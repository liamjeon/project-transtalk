const express = require("express");
const router = express.Router();
const UserController = require("./user.controller.js");
const userController = new UserController();

router.get("/kakao/client",userController.setAuthToClient,  userController.kakaoLogin);
router.get("/kakao/translator",userController.setAuthToTranslator, userController.kakaoLogin);
router.get("/kakao/callback", userController.kakaoCallback);
router.get("/kakao/logout", userController.kakaoLogout);

module.exports = router;
