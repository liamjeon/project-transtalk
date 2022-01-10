const ReviewRepository = require('./review.data.js');
const RequestRepository = require('../request/request.data.js');
const ProfileRepository = require('../profile/profile.data.js');
const reviewRepository = new ReviewRepository();
const requestRepository = new RequestRepository();
const profileRepository = new ProfileRepository();
const { getDateFormat } = require('../../middlewares/middlewares.js');

class ReviewController {
  async htmlCreateReview(req, res, next) {
    const requestId = req.params.requestId;
    const { score, comment } = req.body;
    const reviewDate = getDateFormat();

    try {
      const request = await requestRepository.getById(requestId);
      const translatorId = request.translatorId;
      if(request.status === "ready"){
        return res.status(400).json({message:"번역 완료 후 리뷰 작성 가능합니다."});
      }
      //리뷰 생성
      const result = await reviewRepository.create(
        score,
        comment,
        reviewDate,
        requestId,
        translatorId
      );
      //번역가 프로필정보 > 리뷰 수, 리뷰 평균 점수 업데이트
      await profileRepository.updateByTranslatorId(translatorId, score);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  async htmlGetReview(req, res, next) {
    const requestId = req.parmas.requestId;
    try {
      const request = requestRepository.getById(requestId);
      const translatorId = request.translatorId;

      const result = await reviewRepository.getAllByTranslatorId(translatorId);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}

module.exports = ReviewController;
