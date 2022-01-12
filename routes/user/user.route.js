const express = require("express");
const router = express.Router();
const UserController = require("./user.controller.js");
const userController = new UserController();

router.get("/kakao/client",userController.setAuthToClient,  userController.kakaoLogin);
router.get("/kakao/translator",userController.setAuthToTranslator, userController.kakaoLogin);
router.get("/kakao/callback", userController.kakaoCallback);
router.get("/kakao/logout", userController.kakaoLogout);

//개발자
router.post("/dev/signup", userController.devSignup);
router.get("/dev/login", userController.devLogin);

module.exports = router;
