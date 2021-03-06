const { getDateFormat, getDateFormatDetail} = require("../../middlewares/middlewares.js");
const {
  Room,
  Request,
  Profile,
  User,
  Estimate,
} = require("../../models/models");

class RoomRepository {
  async create(estimateId, requestId) {
    const lastChatDate = 0;
    const isReadClient = true;
    const isReadTranslator = true;
    return Room.create({
      estimateId,
      requestId,
      lastChatDate,
      isReadClient,
      isReadTranslator,
    });
  }

  async getByEstimateId(estimateId) {
    return Room.findOne({ where: { estimateId } });
  }

  async getByClientId(clientId) {
    return Room.findAll({
      include: [
        {
          model: Request,
          where: { clientId },
          attributes: ["status"],
        },
      ],
    });
  }

  async getByTranslatorId(translatorId) {
    return Room.findAll({
      include: [
        {
          model: Estimate,
          where: { translatorId },
          attributes: ["id"],
          include: [
            {
              //
              model: Request,
              attributes: ["id", "field", "beforeLanguage", "afterLanguage"],
              include: [
                {
                  model: User,
                  attributes: ["username"],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getById(id) {
    return Room.findByPk(id);
  }

  
  async updateTime(roomId) {
    return Room.update(
      { lastChatDate: getDateFormatDetail() },
      { where: { id: roomId } }
    );
  }
}

module.exports = RoomRepository;
