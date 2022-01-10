const express = require("express");
const router = express.Router();
const UserController = require("./user.controller.js");
const userController = new UserController();
const isAuth = require('../../middlewares/auth.middleware.js');

//Todo

router.get("/kakao/", userController.kakaoLogin);
router.get("/kakao/callback", userController.kakaoCallback);
router.get("/kakao/logout", userController.kakaoLogout);

module.exports = router;
