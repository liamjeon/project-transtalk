const EstimateRepository = require("./estimate.data.js");
const RequestRepository = require("../request/request.data.js");
const requestRepository = new RequestRepository();
const estimateRepository = new EstimateRepository();
const { getDateFormat } = require("../../middlewares/middlewares.js");

class EstimateController {
  async htmlCreateEstimate(req, res, next) {
    const requestId = req.params.requestId;
    const translatorId = res.locals.user.id;
    const { price, confirmedDate, comment } = req.body;
    const sendDate = getDateFormat();

    //이미 견적을 보냈을 경우 400리턴
    const exEsimate = await estimateRepository.getByRequestIdAndTranslatorId(
      requestId,
      translatorId
    );
    if (exEsimate) return res.status(400).json("이미 견적을 보냈습니다.");

    try {
      const result = await estimateRepository.create(
        price,
        confirmedDate,
        comment,
        sendDate,
        requestId,
        translatorId
      );
      return res.status(201).json({ data: result });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  //상태가 "Ready"인 번역요청 리스트 (내가 견적 보낸 요청은 제외)
  async htmlGetRequestListByStatus(req, res, next) {
    const translatorId = res.locals.user.id;
    try {
      const requests = await requestRepository.getByStatus("ready");
      const myEstimate = await estimateRepository.getAllByTranslatorId(
        translatorId
      );
      //상태가 "Ready"인 번역요청 리스트에서 내가 견적을 보낸 요청을 제외.
      for (let i = 0; i < myEstimate.length; i++) {
        for (let j = 0; j < requests.length; j++) {
          if (myEstimate[i].requestId === requests[j].id) {
            requests.splice(j, 1);
          }
        }
      }
      return res.status(200).json({ data: requests });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  //견적 리스트 클릭시 번역요청정보 받아옴
  async htmlGetRequestById(req, res, next) {
    try {
      //   const userId = req.locals.user.id;
      const requestId = req.params.requestId;
      const request = await requestRepository.getById(requestId);
      const result = {
        requestId: request.id,
        field: request.field,
        beforeLanguage: request.beforeLanguage,
        afterLanguage: request.afterLanguage,
        deadline: request.deadline,
        fileUrl: request.fileUrl,
        needs: request.needs,
        youtubeUrl: request.youtubeUrl,
        isText: request.isText,
      };
      return res.status(200).json({ data: result });
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
    const translatorId = res.locals.user.id;
    try {
      const requests = await requestRepository.getByStatus("ready");
      const myEstimate = await estimateRepository.getAllByTranslatorId(
        translatorId
      );
      //상태가 "Ready"인 번역요청 리스트에서 내가 견적을 보낸견적만 받아옴
      const readyRequets = [];
      myEstimate.forEach((esmimate) => {
        requests.forEach((request) => {
          if (esmimate.requestId === request.id) readyRequets.push(request);
        });
      });
      const confirmedRequets = await requestRepository.getByTranslatorId(
        translatorId
      );
      const result = [...readyRequets, ...confirmedRequets];

      return res.status(200).json({ data: result });
    } catch (error) {
      return res.sendStatus(404);
    }
  }
}
module.exports = EstimateController;
