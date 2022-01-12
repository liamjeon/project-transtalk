const { Chat, User, Room, Request } = require("../../models/models");

class ChatRepository {
  async create(userId, chat, roomId) {
    return Chat.create({ userId, chat, roomId });
  }

  async getByRoomId(roomId) {
    return Chat.findAll({
      where: { roomId },
      // include: [
      //   {
      //     model: User,
      //     attributes: ["auth", "username"],
      //   },
      //   {
      //     model: Room,
      //     attributes: ['requestId'],
      //     include: [
      //       {
      //         model: Request,
      //         attributes: ['clientId','translatorId'],
      //       },
      //     ],
      //   },
      // ],
    });
  }
}

module.exports = ChatRepository;
