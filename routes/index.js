const express = require("express");

const { Room } = require("../models");
const { Chat } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const rooms = await Room.findAll();
    res.render("main", { rooms, title: "GIF 채팅방" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/room", (req, res) => {
  res.render("room", { title: "GIF 채팅방 생성" });
});

router.post("/room", async (req, res, next) => {
  console.log(req.body);
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const io = req.app.get("io");
    io.of("/room").emit("newRoom", newRoom);
    res.redirect(`/room/${newRoom.id}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
