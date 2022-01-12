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
router.get('/',isAuthBoth, roomController.htmlGetAllForClient);
router.get('/',isAuthBoth, roomController.htmlGetAllForTranslator);

module.exports = router;