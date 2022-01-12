const express = require('express');
const router = express.Router();

const ChatController = require('./chat.controller.js');
const chatController = new ChatController();

router.post('/:roomId', chatController.htmlCreate);
router.get('/:roomId', chatController.htmlGetAll);

module.exports = router;