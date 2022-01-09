const EstimateRepository = require("./estimate.data.js");
const estimateRepository = new EstimateRepository();

const RequestRepository = require("../request/request.data.js");
const requestRepository = new RequestRepository();

class EstimateController {
  async htmlCreateEstimate(req, res, next) {
    const requestId = req.params.requestId;
    const translatorId = 1; //임시
    const { price, confirmedDate, comment } = req.body;

    try {
      const result = await estimateRepository.create(
        price,
        confirmedDate,
        comment,
        requestId,
        translatorId
      );
      return res.status(201).json({data: result});
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  async htmlGetRequestListByStatus(req, res, next) {
    try {
      const result = await requestRepository.getByStatus("ready");
      return res.status(200).json({data: result});
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  //견적 리스트 클릭시 견적(Estimate) 리스트를 받아옴
  async htmlGetRequestById(req, res, next) {
    try {
      //   const userId = req.locals.user.id;
      const requestId = req.params.requestId;
      const result = await requestRepository.getById(requestId);
      return res.status(200).json({data: result});
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  //내 번역 리스트
  // 1. 내가 견적을 보냈는데 아직 확정이 안된것.
  // 2. 내가 이미 진행중이나, 완료된 것.
  // 3. 견적을 보냈으나, 다른 사람으로 확정된 것.
  // 4. 만료 기간이 지난것
  async htmlGetMyTransList(req, res, next) {
    try {
      //Todo
      // const translatorId = req.locals.user.id;
      const translatorId =1; //임시
      const estimates = await estimateRepository.getAllByTranslatorId(translatorId);

      let requests = [];
      for (let estimate of estimates) {
        console.log(estimate.requestId);
        let request = await requestRepository.getById(estimate.requestId);
        if (request) {
          requests.push(request);
        }
      }
      return res.status(200).json({data: requests});
    } catch (error) {
      return res.sendStatus(404);
    }
  }
}

module.exports = EstimateController;
