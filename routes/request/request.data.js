const { Request, User } = require("../../models/models");

class RequestRepository {
  async create(request) {
    return Request.create(request);
  }
  async getByStatusAndId(userId) {
    return Request.findAll({ where: { status: "ready", clientId: userId } });
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

  async updateStatus(status, translatorId, requestId) {
    return Request.update({ status, translatorId }, { where: { id: requestId } });
  }
}

module.exports = RequestRepository;
