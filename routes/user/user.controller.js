const express = require("express");
const passport = require("passport");

// const UseRepository = require("./user.data.js");
// const userRepository = userRepository();
// const { User } = require("../../models/models");

class UserController {
  kakaoLogin(req, res, next) {
    passport.authenticate("kakao");
  }

  kakaoCallback(req, res, next) {
    return [
      passport.authenticate("kakao", {
        failureRedirect: "/",
      }),
      (req, res) => {
        res
          .status(200)
          .json({ message: "로그인 성공", sessionId: req.sessionID }); //로그인성공
      },
    ];
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
}

module.exports = UserController;
