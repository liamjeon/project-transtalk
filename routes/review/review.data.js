const { Review } = require("../../models/models");

class ReviewRepository {
  async create(score, comment, reviewDate, clientId, requestId, translatorId, username) {
    return Review.create({
      score,
      comment,
      reviewDate,
      clientId,
      requestId,
      translatorId,
      username,
    });
  }

  async getAllByTranslatorId(translatorId) {
    return Review.findAll({ where: { translatorId } });
  }

  async getByRequestId(requestId){
    return Review.findOne({ where: { requestId } });
  }
}

module.exports = ReviewRepository;
