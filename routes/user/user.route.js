const express = require("express");
const router = express.Router();
const UserController = require("./user.controller.js");
const passport = require("passport");
const axios = require("axios");
const { isLoggedIn, isNotLoggedIn } = require("../../middlewares/auth.middleware.js");

// const userController =  UserController();
// router.post('/join', userController.create);
router.get("/",isNotLoggedIn);

router.get("/kakao",isNotLoggedIn, passport.authenticate("kakao"));
router.get(
  "/kakao/callback", isNotLoggedIn, 
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.status(200).json({message:"로그인 성공", sessionId:req.sessionID}); //로그인성공
  }
);

router.get("/kakao/logout", isLoggedIn, async (req, res, next) => {
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
  console.log(req.user);
});

module.exports = router;
