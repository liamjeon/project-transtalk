const jwt = require("jsonwebtoken");
const qs = require("qs"); // 쿼리스트링 인코딩
const axios = require("axios");
const UserRepository = require("./user.data.js");
const userRepository = new UserRepository();

class UserController {
  async kakaoLogin(req, res, next) {
    ///1. 인가 코드 요청
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URL}&response_type=code`;
    res.redirect(kakaoAuthURL);
  }

  async kakaoCallback(req, res) {
    console.log(req.app.locals.userType);
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
          code: req.query.code, //인가 코드 받기 요청으로 얻은 인가 코드
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

      // 4. JWT Token 생성 후 프론트에 전달.
      const kakaoId = kakaoUser.data.id;
      const exUser = await userRepository.getByKakaoId(kakaoId);
      let approve;
      const auth = req.app.locals.userType;
      if (!exUser) {
        //DB에 없는 유저라면 자동 회원가입
        if (auth === "client") approve = true;
        else approve = true; //번역가는 승인을 받아야 됨. 임시로 true;
        await userRepository.create("미지정", kakaoId, auth, "kakao", approve);
      } else {
        await userRepository.updateAuth(kakaoId, auth);
      }

      //5. JWT token 생성 후
      const jwtToken = jwt.sign({ id: kakaoId }, process.env.JWT_SECRETKEY, {
        expiresIn: process.env.JWT_EXPRIERSDAYS,
      });
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
      return res.sendStatus(400);
    }
  }
}

module.exports = UserController;
