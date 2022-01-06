const passport = require("passport");
const kakao = require("./kakaoStrategy");
const { User } = require("../models/models");

module.exports = () => {
  //로그인시 실행되며 req.session 객체에 어떤 데이터를 저장할지 결정한다.
  //매개변수로 user를 받고, done 함수의 두번째 인수에 user.id를 넘긴다.
  //로그인시에만 실행
  //user: 로그인 사용자 정보
  passport.serializeUser((user, done) => {
    console.log("Call serializeUser");
    done(null, { id: user.userInfo.id, accessToken: user.accessToken });
  });

  //세션에 저장한 아이디를 통해 사용자 정보 객체를 불러온다.
  //user --> req.user에 저장
  //매 요청마다 실행
  //id : 세션에 저장했던 id
  //accessToken : 카카로에서 발급해준 accessToken 로그아웃때 이용한다.
  passport.deserializeUser((user, done) => {
    console.log("Call deserializeUser");
    User.findOne({ where: { id: user.id } })
      .then((exUser) => {
        const data = { info: exUser, accessToken: user.accessToken };
        done(null, data);
      })
      .catch((err) => done(err));
  });

  kakao();
};
