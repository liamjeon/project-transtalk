const { Room, Request } = require("../../models/models");

class RoomRepository {
  async create(requestId) {
    return Room.create(requestId);
  }

  async getByClientId(clientId) {
    return Room.findAll({
      include: [
        {
          model: Request,
          where: { clientId },
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
        },
      ],
    });
  }
}

module.exports = RoomRepository;
