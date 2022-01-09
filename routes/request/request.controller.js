const RequestRepository = require("./request.data.js");
const requestRepository = new RequestRepository();

const EstimateRepository = require('../estimate/estimate.data.js');
const estimateRepository = new EstimateRepository();

class RequestController {
  async htmlCreateRequest(req, res, next) {
    // const clientId = req.locals.user.id;
    const clientId = 1; //임시
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
      return res.status(201).json({data: result});
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  async htmlGetRequestListById(req, res, next) {
    try {
      //   const userId = req.locals.user.id;
      const userId = 1; //임시
      const result = await requestRepository.getByStatusAndId(userId);
      return res.status(200).json({data: result});
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  async htmlGetRequestListByStatus(req, res, next) {
    try {
      const status = "ready";
      const result = await requestRepository.getByStatus(status);
      return res.status(200).json({data: result});
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  //견적 리스트 클릭시 RequestId 에 해당하는 견적(Estimate) 리스트를 받아옴
  async htmlGetEstimateByRequestId(req, res, next) {
    const requestId = req.params.requestId;
    console.log(requestId);
    try {
      const result = await estimateRepository.getAllByRequestId(requestId);
      return res.status(200).json({data: result});
    } catch (error) {
      return res.sendStatus(404);
    }
  }
}

module.exports = RequestController;
