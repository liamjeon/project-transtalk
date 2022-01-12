const RequestRepository = require("./request.data.js");
const requestRepository = new RequestRepository();

const EstimateRepository = require("../estimate/estimate.data.js");
const estimateRepository = new EstimateRepository();

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
        needs: req.body.needs,
        isText: req.body.isText,
        clientId,
      });
      return res.status(201).json({ data: result });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  async htmlGetRequestListById(req, res, next) {
    try {
      //   const userId = req.locals.user.id;
      const userId = 1; //임시
      const result = await requestRepository.getByStatusAndId(userId);
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
          price: estimate.price,
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

  //견적 리스트 클릭시 RequestId 에 해당하는 견적(Estimate) 리스트를 받아옴
  async htmlGetEstimateByRequestId(req, res, next) {
    const estimateId = req.params.estimateId;
    try {
      let result = await estimateRepository.getByEsimateId(estimateId);
      //데이터 가공
      const estimate = {
        price: result.price,
        confirmedDate: result.confirmedDate,
        comment: result.comment,
        sendDate: result.sendDate,
        translatorId: result.translatorId,
        requestId: result.requestId,
        ...result.User.Profile.dataValues,
      };

      return res.status(200).json({ data: estimate });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  async htmlUpdateStatusToDone(req, res, next) {
    const requestId = req.params.requestId;
    const translatorId = res.locals.user.id;
    try {
      let request = await requestRepository.getById(requestId);
      //내가 번역 작업중인 번역요청이 아니라면
      if(request.translatorId !== translatorId) {
        return res.status(403).json({ message: "내가 진행중인 번역 작업이 아닙니다." });
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
}

module.exports = RequestController;
