const express = require('express');
const router = express.Router();

const RoomController = require('./room.controller.js');
const roomController = new RoomController();
const {
    isAuthForClient,
    isAuthForTranslaotr,
    isProfile,
    isAuthBoth,
  } = require("../../middlewares/auth.middleware.js");

router.post('/:requestId',isAuthBoth, roomController.htmlCreate);
router.get('/client',isAuthBoth, roomController.htmlGetAllForClient);
router.get('/translator',isAuthBoth, roomController.htmlGetAllForTranslator);

module.exports = router;