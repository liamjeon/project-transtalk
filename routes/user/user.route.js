const express = require("express");
const router = express.Router();
const UserController = require("./user.controller.js");
const userController = new UserController();

router.get("/kakao/client/:code",userController.setAuthToClient,  userController.kakaoCallback);
router.get("/kakao/translator/:code",userController.setAuthToTranslator, userController.kakaoCallback);
router.get("/kakao/callback", userController.kakaoCallback);
router.get("/kakao/logout", userController.kakaoLogout);

//개발자
router.post("/dev/signup", userController.devSignup);
router.post("/dev/login", userController.devLogin);

module.exports = router;
