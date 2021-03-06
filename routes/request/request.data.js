const { Request, User } = require("../../models/models");

class RequestRepository {
  async create(request) {
    return Request.create(request);
  }
  async getByStatusAndId(userId) {
    return Request.findAll({ where: { status: "ready", clientId: userId } });
  }

  async getByClientId(userId) {
    return Request.findAll({ where: { clientId: userId } });
  }

  async getByStatus(status) {
    return Request.findAll({
      where: { status },
      attributes: [
        "id",
        "field",
        "beforeLanguage",
        "afterLanguage",
        "deadline",
        "fileUrl",
        "needs",
        "youtubeUrl",
        "isText",
        "status",
        "createdAt",
        "estimateId"
      ],
      include: [
        {
          model: User,
          attributes: ["username", "snsId"],
        },
      ],
    });
  }
  async getByTranslatorId(translatorId) {
    return Request.findAll({ where: { translatorId } });
  }

  async getFilterByTranslatorId(translatorId) {
    return Request.findAll({
      where: { translatorId },
      attributes: [
        "id",
        "field",
        "beforeLanguage",
        "afterLanguage",
        "deadline",
        "fileUrl",
        "needs",
        "youtubeUrl",
        "isText",
        "status",
        "createdAt",
      ],
      include: [
        {
          model: User,
          attributes: ["username", "snsId"],
        },
      ],
    });
  }

  async getById(id) {
    return Request.findByPk(id);
  }
  async getByIdWithName(id) {
    return Request.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
  }

  async updateStatus(status, requestId) {
    return Request.update(
      { status },
      { where: { id: requestId } }
    );  
  }

  async confirmTranslator(
    requestId,
    confirmedTranslator,
    confirmedDate,
    confirmedPrice,
    translatorId,
    estimateId
  ) {
    return Request.update(
      { confirmedTranslator, confirmedDate, confirmedPrice, translatorId, estimateId },
      { where: { id: requestId } }
    );
  }
}

module.exports = RequestRepository;
