const { Review } = require('../../models/models');

class ReviewRepository {
  async create(score, comment, reviewDate, requestId, translatorId) {
    return Review.create({
      score,
      comment,
      reviewDate,
      requestId,
      translatorId,
    });
  }

  async getAllByTranslatorId(translatorId) {
    return Review.findAll({ where: { translatorId } });
  }
}

module.exports = ReviewRepository;
