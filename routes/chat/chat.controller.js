const ChatRepository = require("./chat.data.js");
const chatRepository = new ChatRepository();

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
    const { roomId } = req.body;
    try {
      const result = await chatRepository.getByRoomId(roomId);
      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
}

module.exports = ChatController;
