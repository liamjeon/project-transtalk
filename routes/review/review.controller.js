const ReviewRepository = require("./review.data.js");
const RequestRepository = require("../request/request.data.js");
const ProfileRepository = require("../profile/profile.data.js");
const UserRepository = require('../user/user.data.js');
const userRepository = new UserRepository();
const reviewRepository = new ReviewRepository();
const requestRepository = new RequestRepository();
const profileRepository = new ProfileRepository();
const { getDateFormat } = require("../../middlewares/middlewares.js");

class ReviewController {
  async htmlCreateReview(req, res, next) {
    const requestId = req.params.requestId;
    const { score, comment } = req.body;
    const clientId = res.locals.user.id;
    const reviewDate = getDateFormat();

    try {
      const request = await requestRepository.getById(requestId);
      const exUser = await userRepository.getById(clientId);
      const exReview = await reviewRepository.getByRequestId(requestId);
      const translatorId = request.translatorId;

      //[예외처리]번역 완료 후 리뷰 작성 가능합니다.
      if (request.status === "ready" || request.status === "processing") {
        return res
          .status(400)
          .json({ message: "번역 완료 후 리뷰 작성 가능합니다." });
      }

      //[예외처리]이미 리뷰를 등록하였습니다.
      if(exReview){
        return res
          .status(400)
          .json({ message: "이미 리뷰를 등록했습니다." });
      }

      // //리뷰 생성
      const result = await reviewRepository.create(
        score,
        comment,
        reviewDate,
        clientId,
        requestId,
        translatorId,
        exUser.username
      );
      // //번역가 프로필정보 > 리뷰 수, 리뷰 평균 점수 업데이트
      await profileRepository.updateReviewInfo(translatorId, score);

      // const result = [];
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  async htmlGetReview(req, res, next) {
    const translatorId = req.params.translatorId;
    try {
      const result = await reviewRepository.getAllByTranslatorId(translatorId);
      return res.status(201).json({ data: result });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}

module.exports = ReviewController;
