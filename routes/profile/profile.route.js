const express = require('express');
const ProfileController = require('./profile.controller.js');
const isAuth = require('../../middlewares/auth.middleware.js');
const router = express.Router();
const profileController = new ProfileController();


router.post('/mypage',isAuth, profileController.htmlCreateProfile);
router.get('/mypage',isAuth, profileController.htmlGetProfile);
router.post('/mypage/update',isAuth, profileController.htmlUpdateProfile);

module.exports = router;