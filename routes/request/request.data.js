const { Request } = require("../../models/models");

class RequestRepository {
  async create(request) {
    return Request.create(request);
  }
  async getByStatus(userId) {
    return Request.findAll({ where: { status: "ready", clientId: userId } });
  }
  async getById(id) {
    return Request.findByPk(id);
  }
}

module.exports = RequestRepository;
