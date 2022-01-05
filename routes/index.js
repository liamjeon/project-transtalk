const express = require("express");

const { Room } = require("../models/models");
const { Chat } = require("../models/models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const rooms = await Room.findAll();
    res.render("index", { rooms, title: "GIF 채팅방" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/room", (req, res) => {
  res.render("room", { title: "GIF 채팅방 생성" });
});


router.post('/room', async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const io = req.app.get('io');
    io.of('/namespace1').emit('newRoom', newRoom);
    res.redirect(`/`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ id: req.params.id });
    const io = req.app.get('io');
    if (!room) {
      return res.redirect('/?error=존재하지 않는 방입니다.');
    }

    const chats = await Chat.findAll();
    return res.render('chat', {
      room,
      title: room.title,
      chats: chats,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      roomId: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.redirect(`/room/${req.params.id}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
