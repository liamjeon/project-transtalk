const express = require("express");
const router = express.Router();

const userRouter = require("./user/user.route.js");
const requestRouter = require("./request/request.route.js");
const estimateRouter = require("./estimate/estimate.route.js");
const profileRouter = require("./profile/profile.route.js");
const reviewRouter = require("./review/review.route.js");
const roomRouter = require("./room/room.route.js");
const chatRouter = require("./chat/chat.route.js");

router.use("/auth", userRouter);
router.use("/request", requestRouter);
router.use("/estimate", estimateRouter);
router.use("/translator", profileRouter);
router.use("/review", reviewRouter);
router.use("/chatroom", roomRouter);
router.use("/chatroom/chat", chatRouter);

module.exports = router;