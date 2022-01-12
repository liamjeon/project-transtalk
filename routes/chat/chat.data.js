const { Chat } = require("../../models/models");

class ChatRepository {
  async create(userId, chat, roomId) {
    return Chat.create({ userId, chat, roomId });
  }

  async getByRoomId(roomId) {
    return Chat.findAll({ where: roomId });
  }
}

module.exports = ChatRepository;
