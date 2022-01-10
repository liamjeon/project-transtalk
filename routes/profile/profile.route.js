const express = require("express");
const router = express.Router();

const ProfileController = require("./profile.controller.js");
const profileController = new ProfileController();
const { isAuthForTranslaotr } = require("../../middlewares/auth.middleware.js");

router.post(
  "/mypage",
  isAuthForTranslaotr,
  profileController.htmlCreateProfile
);
router.get("/mypage", isAuthForTranslaotr, profileController.htmlGetProfile);
router.post(
  "/mypage/update",
  isAuthForTranslaotr,
  profileController.htmlUpdateProfile
);

module.exports = router;
