const {
  Estimate,
  User,
  Profile,
  Request,
  Review,
} = require("../../models/models");

class EstimateRepository {
  async create(
    price,
    confirmedDate,
    comment,
    sendDate,
    requestId,
    translatorId
  ) {
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

  async getAllWithRequestByTranslatorId(translatorId) {
    return Estimate.findAll({
      where: { translatorId },
      include: [
        {
          model: Request,
          include: [{ model: User }],
        },
      ],
    });
  }

  //RequestId를 키로 모든 견적과 견적을 보낸 번역가 프로필 정보를 가져옴
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
                "totalTrans",
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

  //RequestId를 키로 하나의 견적과 견적을 보낸 번역가 프로필 정보를 가져옴
  async getByEsimateId(estimateId) {
    return Estimate.findOne({
      where: { id: estimateId },
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
                "totalTrans",
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
