const express = require("express");
const passport = require("passport");
const axios = require("axios");
const router = express.Router();
const {
  isLoggedIn,
  isNotLoggedIn,
} = require("../../middlewares/auth.middleware.js");

const UserController = require("./user.controller.js");
const userController = new UserController();

//Todo
//userController에 loing/ callback 추가

router.get("/kakao", isNotLoggedIn, passport.authenticate("kakao"));
router.get("/kakao/logout", isLoggedIn, userController.kakaoLogout);
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    req.locals.user = req.user.info; //req.locals.user에 passport.deserializeUser 에서 저장한 user 정보를 담음.
    res.status(200).json({ message: "로그인 성공", sessionId: req.sessionID }); //로그인성공
  }
);

module.exports = router;
