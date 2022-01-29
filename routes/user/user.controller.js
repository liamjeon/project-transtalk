const jwt = require("jsonwebtoken");
const qs = require("qs"); // 쿼리스트링 인코딩
const axios = require("axios");
const UserRepository = require("./user.data.js");
const userRepository = new UserRepository();
const ProfileRepository = require('../profile/profile.data.js');
const profileRepository = new ProfileRepository();

class UserController {
  async kakaoLogin(req, res, next) {
    //1. 인가 코드 요청
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URL}&response_type=code`;
    res.redirect(kakaoAuthURL);
  }

  async kakaoCallback(req, res, next) {
    console.log(req.params.code);
    try {
      //2. 토근 발행. 카카오서버는 인가 코드를 설정한 Callback URL로 Redirect 해준다.
      const kakaoToken = await axios({
        method: "POST",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          grant_type: "authorization_code", //authorization_code로 고정
          client_id: process.env.KAKAO_KEY, //앱 REST API 키
          redirectUri: process.env.KAKAO_REDIRECT_URL, //인가 코드가 리다이렉트된 URI
          code: req.params.code, //인가 코드 받기 요청으로 얻은 인가 코드
        }),
      });

      // 3. 카오서버로 부터 받아온 AccessToken을 이용하여 Kakao 유저 데이터를 받음
      const kakaoUser = await axios({
        method: "get",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
          Authorization: `Bearer ${kakaoToken.data.access_token}`,
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      //[예외처리] 카카오 로그인 실패시
      if (!kakaoUser) {
        return res.status(401).json({ message: "카카오 로그인 실패" });
      }

      // 4. JWT Token 생성 후 프론트에 전달.
      let approve = true; //계정 승인 여부
      const kakaoId = kakaoUser.data.id;
      const exUser = await userRepository.getByKakaoId(kakaoId);
      const auth = req.app.locals.userType;

      //DB에 없는 유저라면 자동 회원가입
      if (!exUser) {
        //번역가는 최초 가입시 승인여부가 False, 승인을 받아야만 로그인 가능
        if (auth == "translator") {
          approve = false; //번역가는 승인을 받아야 됨. 임시로 true;
        } 
        //username : kakaiId 마지막 4자리
        const username = kakaoId.toString().slice(0, 4);
        await userRepository.create(username, kakaoId, auth, "kakao", approve);
      } 

      //[예외처리]번역가 승인 받지 않는 유저라면 로그인 불가.
      if (exUser.auth == "translator" && exUser.approve == false) {
        return res
          .status(401)
          .json({ message: "번역가 승인 후 로그인 가능합니다." });
      }
      //[예외처리] 클라이언트가 번역가로로 로그인할 경우
      if (auth == "translator" && exUser.auth == "client") {
        return res
          .status(401)
          .json({ message: "번역가로 로그인할 수 없습니다." });
      }
      //[예외처리] 번역가가 클라이언트로 로그인할 경우
      if (auth == "client" && exUser.auth == "translator") {
        return res.status(401).json({ message: "번역가로 로그인하세요." });
      }

      //5. JWT token 생성 후
      const jwtToken = jwt.sign({ id: kakaoId }, process.env.JWT_SECRETKEY, {
        expiresIn: process.env.JWT_EXPRIERSDAYS,
      });

      if(exUser.auth == 'translator'){
        const exProfile = await profileRepository.getByTranslatorId(exUser.id);
        if(exProfile){
          return res.status(200).json({ token: jwtToken, auth, isProfile: true });
        }
        else{
          return res.status(200).json({ token: jwtToken, auth, isProfile: false });
        }
      }
      return res.status(200).json({ token: jwtToken, auth });
    } catch (error) {
      return res.sendStatus(401);
    }
  }

  setAuthToClient(req, res, next) {
    req.app.locals.userType = "client";
    next();
  }
  setAuthToTranslator(req, res, next) {
    req.app.locals.userType = "translator";
    next();
  }

  async kakaoLogout(req, res, next) {
    try {
      const ACCESS_TOKEN = req.user.accessToken;
      console.log("ACCESS_TOKEN");
      console.log(ACCESS_TOKEN);
      await axios({
        method: "post",
        url: "https://kapi.kakao.com/v1/user/unlink",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
    // 세션 정리
    req.logout(); //passport를 통해 req에 저장했던 user를 삭제한다.
    req.session.destroy(); //session 삭제
  }

  //개발자용 계정 생성
  async devSignup(req, res, next) {
    const { id, auth } = req.body;
    console.log(id, auth);
    try {
      const exUser = await userRepository.getByKakaoId(id);
      if (!exUser) {
        const result = await userRepository.create(
          "개발자",
          id,
          auth,
          "dev",
          true
        );
        return res
          .status(201)
          .json({ data: result, message: "회원가입 가입완료" });
      } else {
        return res.status(401).json({ message: "이미 가입된 아이디입니다." });
      }
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  //개발자용 계정 로그인
  async devLogin(req, res, next) {
    const { id } = req.body;
    const exUser = await userRepository.getByKakaoId(id);

    if (!exUser) {
      return res.status(401).json({ message: "등록된 아이디가 없습니다." });
    }
    try {
      const jwtToken = jwt.sign({ id }, process.env.JWT_SECRETKEY, {
        expiresIn: process.env.JWT_EXPRIERSDAYS,
      });
      return res.status(200).json({ token: jwtToken, auth: exUser.auth });
    } catch (error) {
      return res.sendStatus(40);
    }
  }
}

module.exports = UserController;
