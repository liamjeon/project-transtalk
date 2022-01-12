const ChatRepository = require("./chat.data.js");
const RequestRepository = require('../request/request.data.js');
const RoomRepository = require("../room/room.data.js");

const chatRepository = new ChatRepository();
const requestRepository = new RequestRepository();
const roomRepository = new RoomRepository();


class ChatController {
  async htmlCreate(req, res, next) {
    const userId = res.locals.user.id;
    const roomId = req.params.roomId;
    const { chat } = req.body;
    try {
      const result = await chatRepository.create(userId, chat, roomId);
      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  async htmlGetAll(req, res, next) {
    const roomId = req.params.roomId;
    try {
      const result = await chatRepository.getByRoomId(14);
      return res.status(201).json({ data: result });
    } catch (error) {
      return res.sendStatus(400);
    }
  }
}

module.exports = ChatController;
