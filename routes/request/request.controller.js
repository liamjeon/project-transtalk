const RequestRepository = require("./request.data.js");
const EstimateRepository = require("../estimate/estimate.data.js");
const ProfileRepository = require("../profile/profile.data.js");
const RoomRepository = require('../room/room.data.js');
const requestRepository = new RequestRepository();
const estimateRepository = new EstimateRepository();
const profileRepository = new ProfileRepository();
const roomRepository = new RoomRepository();

class RequestController {
  async htmlCreateRequest(req, res, next) {
    const clientId = res.locals.user.id;
    try {
      const result = await requestRepository.create({
        status: "ready",
        field: req.body.field,
        beforeLanguage: req.body.beforeLanguage,
        afterLanguage: req.body.afterLanguage,
        deadline: req.body.deadline,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        fileUrl: req.body.fileUrl,
        youtubeUrl: req.body.youtubeUrl,
        needs: req.body.needs,
        isText: req.body.isText,
        clientId,
        translatorId: 0,
      });
      return res.status(201).json({ data: result });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  async htmlGetRequestListById(req, res, next) {
    try {
      const userId = res.locals.user.id;
      const result = await requestRepository.getByClientId(userId);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  async htmlGetRequestListByStatus(req, res, next) {
    try {
      const status = "ready";
      const result = await requestRepository.getByStatus(status);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  //견적 리스트 클릭시 RequestId 에 해당하는 견적(Estimate) 리스트를 받아옴
  async htmlGetAllEstimateByRequestId(req, res, next) {
    const requestId = req.params.requestId;
    console.log(requestId);
    try {
      let estimates = await estimateRepository.getAllByRequestId(requestId);
      //데이터 가공
      const result = estimates.map((estimate) => {
        estimate = {
          estimateId: estimate.id,
          offerPrice: estimate.offerPrice,
          confirmedDate: estimate.confirmedDate,
          comment: estimate.comment,
          sendDate: estimate.sendDate,
          translatorId: estimate.translatorId,
          requestId: estimate.requestId,
          ...estimate.User.Profile.dataValues,
        };
        return estimate;
      });

      return res.status(200).json({ data: result });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  //견적 클릭시 RequestId 에 해당하는 견적(Estimate) 상세 정보를 가져옴
  async htmlGetEstimateByRequestId(req, res, next) {
    const estimateId = req.params.estimateId;
    const requestId = req.params.requestId;
    const userId = res.locals.user.id;
    try {
      //[예외처리]요청한 번역요청이 없을 떄
      const request = await requestRepository.getById(requestId);
      if (!request) {
        return res
          .status(400)
          .json({ message: "해당하는 번역요청이 없습니다." });
      }
      //[예외처리]요청한 번역요청이 나의 소유가 아닐 때
      if (userId !== request.clientId) {
        return res
          .status(400)
          .json({ message: "내가 요청한 번역이 아닙니다." });
      }

      //[예외처리]요청한 견적이 없을 때
      let result = await estimateRepository.getByEsimateId(estimateId);
      if (!result) {
        return res
          .status(400)
          .json({ message: "해당하는 견적 요청이 없습니다." });
      }
      //[예외처리] 견적이 관계된 번역요청에 속하지 않은 경우
      console.log(result.requestId, requestId);
      if(result.requestId != requestId){
        return res
          .status(400)
          .json({ message: `${requestId}번 번역요청에 속하지 않는 견적입니다.` });
      }

      const room = await roomRepository.getByEstimateId(estimateId);
      let roomId = 0;
      if(room){
        roomId = room.id;
      }
      
      //데이터 가공
      const estimate = {
        offerPrice: result.offerPrice,
        confirmedDate: result.confirmedDate,
        comment: result.comment,
        sendDate: result.sendDate,
        translatorId: result.translatorId,
        requestId: result.requestId,
        status: request.status,
        roomId,
        ...result.User.Profile.dataValues,
      };

      return res.status(200).json({ data: estimate });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  //[번역가] 번역 요청 상태 "완료(done)"으로 변경
  async htmlUpdateStatusToDone(req, res, next) {
    const requestId = req.params.requestId;
    const translatorId = res.locals.user.id;
    try {
      let request = await requestRepository.getById(requestId);
      //내가 번역 작업중인 번역요청이 아니라면
      if (request.translatorId !== translatorId) {
        return res
          .status(403)
          .json({ message: "내가 진행중인 번역 작업이 아닙니다." });
      }
      //번역 요청 상태 done으로 업데이트
      let result = await requestRepository.updateStatus(
        "done",
        translatorId,
        requestId
      );
      return res.status(200).json({ message: "번역 작업 완료(done)" });
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  //[클라이언트] 번역가 확정
  async htmlconfirmTranslator(req, res, next) {
    const requestId = req.params.requestId;
    const estimateId = req.params.estimateId;
    const userId = res.locals.user.id;

    try {
      const request = await requestRepository.getById(requestId);
      //나의 번역요청이 아닐떄 리턴
      if (request.clientId !== userId) {
        return res
          .status(403)
          .json({ message: "내가 요청한 번역이 아닙니다." });
      }
      const estimate = await estimateRepository.getById(estimateId);
      const profile = await profileRepository.getByTranslatorId(
        estimate.translatorId
      );

      //번역 요청에 번역가 정보 업데이트
      await requestRepository.confirmTranslator(
        requestId,
        profile.name,
        estimate.confirmedDate,
        estimate.offerPrice,
        estimate.translatorId
      );

      //번역 요청 상태를 processing 으로 변경
      await requestRepository.updateStatus(
        "processing",
        estimate.translatorId,
        requestId
      );

      return res.status(201).json({ message: "번역가(견적) 확정!" });
    } catch (error) {
      return res.sendStatus(400);
    }
  }
}

module.exports = RequestController;
