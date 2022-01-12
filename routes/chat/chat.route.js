const express = require('express');
const router = express.Router();
const ChatController = require('./chat.controller.js');
const chatController = new ChatController();
const {
    isAuthForClient,
    isAuthForTranslaotr,
    isAuthBoth,
  } = require("../../middlewares/auth.middleware.js");

router.post('/:roomId',isAuthBoth, chatController.htmlCreate);
router.get('/:roomId',isAuthBoth, chatController.htmlGetAll);

module.exports = router;