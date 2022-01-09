const express = require('express');
const router = express.Router();

const ProfileController = require('./profile.controller.js');
const profileController = new ProfileController();

router.post('/mypage',profileController.htmlCreateProfile);
router.get('/mypage',profileController.htmlGetProfile);
router.post('/mypage/update',profileController.htmlUpdateProfile);

module.exports = router;