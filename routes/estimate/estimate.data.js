const { Estimate, User, Profile } = require("../../models/models");
const { getDateFormat } = require("../../middlewares/middlewares.js");

class EstimateRepository {
  async create(price, confirmedDate, comment, requestId, translatorId) {
    const sendDate = getDateFormat();

    return Estimate.create({
      price,
      confirmedDate,
      comment,
      sendDate,
      requestId,
      translatorId,
    });
  }
  async getByStatus(userId) {
    // return Estimate.findAll({ where: { status: "ready", clientId: userId } });
  }

  async getAllById(id) {
    return Estimate.findAll({ where: { id } });
  }

  async getAllByTranslatorId(translatorId) {
    return Estimate.findAll({ where: { translatorId } });
  }

  async getByRequestIdAndTranslatorId(requestId, translatorId) {
    return Estimate.findOne({ where: { requestId, translatorId } });
  }

  //RequestId를 키로 견적과 견적을 보낸 번역가 정보를 리턴
  async getAllByRequestId(requestId) {
    return Estimate.findAll({
      where: { requestId },
      attributes: [
        "id",
        "price",
        "confirmedDate",
        "comment",
        "sendDate",
        "translatorId",
        "requestId",
      ],
      include: [
        {
          model: User,
          attributes: ["auth"],
          include: [
            {
              model: Profile,
              attributes: [
                "name",
                "career",
                "profileUrl",
                "language",
                "introduce",
                "totalReviews",
                "avgReviews",
                "taxPossible",
                "cashPossible",
                "isBusiness",
              ],
            },
          ],
        },
      ],
    });
  }

  async getById(id) {
    return Estimate.findByPk(id);
  }
}

module.exports = EstimateRepository;
