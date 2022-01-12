const { Room, Request, Profile } = require("../../models/models");

class RoomRepository {
  async create(requestId) {
    const lastChatDate = 0;
    const isReadClient = true;
    const isReadTranslator = true;
    return Room.create({
      requestId,
      lastChatDate,
      isReadClient,
      isReadTranslator,
    });
  }

  async getByRequestId(requestId) {
    return Room.findOne({ where: { requestId } });
  }

  async getByClientId(clientId) {
    return Room.findAll({
      include: [
        {
          model: Request,
          where: { clientId },
          attributes:[
            'confirmedTranslaotr','status',
          ]
        },
      ],
    });
  }

  async getByTranslatorId(translatorId) {
    return Room.findAll({
      include: [
        {
          model: Request,
          where: { translatorId },
          attributes:[
            'confirmedTranslaotr','status',
          ]
        },
      ],
    });
  }
}

module.exports = RoomRepository;
