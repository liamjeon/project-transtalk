const { Request } = require("../../models/models");

class RequestRepository {
  async create(request) {
    return Request.create(request);
  }
  async getByStatusAndId(userId) {
    return Request.findAll({ where: { status: "ready", clientId: userId } });
  }
  async getByStatus(status) {
    return Request.findAll({ where: { status } });
  }
  async getByTranslatorId(translatorId) {
    return Request.findAll({ where: { translatorId } });
  }

  async getById(id) {
    return Request.findByPk(id);
  }
}

module.exports = RequestRepository;
