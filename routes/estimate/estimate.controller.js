const EstimateRepository = require("./estimate.data.js");
const RequestRepository = require("../request/request.data.js");
const RoomRepository = require('../room/room.data.js');
const requestRepository = new RequestRepository();
const estimateRepository = new EstimateRepository();
const roomRepository = new RoomRepository();
const { getDateFormat } = require("../../middlewares/middlewares.js");

class EstimateController {
  async htmlCreateEstimate(req, res, next) {
    const requestId = req.params.requestId;
    const translatorId = res.locals.user.id;
    const { offerPrice, confirmedDate, comment } = req.body;
    const sendDate = getDateFormat();

    //이미 견적을 보냈을 경우 400리턴
    const exEsimate = await estimateRepository.getByRequestIdAndTranslatorId(
      requestId,
      translatorId
    );
    if (exEsimate) return res.status(400).json("이미 견적을 보냈습니다.");

    try {
      const result = await estimateRepository.create(
        offerPrice,
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

  //견적 리스트 클릭시 번역요청상세 정보 받아옴
  async htmlGetRequestById(req, res, next) {
    try {
      //   const userId = req.locals.user.id;
      const requestId = req.params.requestId;
      const translatorId = res.locals.user.id;
      const request = await requestRepository.getByIdWithName(requestId);
      const esmimate = await estimateRepository.getByRequestId( requestId );
      const exRoom = await roomRepository.getByEstimateId(esmimate.dataValues.id);
      let roomId, roomCreateAt;
      if(!exRoom){
        roomId  = 0;
        roomCreateAt = 0;
      }
      else{
        roomId = exRoom.dataValues.id;
        roomCreateAt = exRoom.createdAt;
      }
      //필요 정보들 필터링, 개인 정보 제외(email, phoneNumber)
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
        status: request.status,
        ...esmimate.dataValues,
        roomId: roomId,
        roomCreateAt: roomCreateAt,
        username: request.User.username,
      };
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  // <번역 상태>
  // ready : 견적 받는중(견적을 보냈는데 아직 확정이 안된)
  // processing : 번역 진행 중
  // done : 종료
  // passdate: 확정 날짜(3일)를 넘김
  async htmlGetMyTransList(req, res, next) {
    const translatorId = res.locals.user.id;
    try {
      const requests = await requestRepository.getByStatus("ready"); //상태가 "ready"인 모든 번역 요청
      const myEstimate = await estimateRepository.getAllByTranslatorId(
        //내가 견적 보낸 모든 견적요청
        translatorId
      );
      //상태가 "Ready"인 번역요청 리스트에서 내가 견적을 보낸요청만 받아옴
      const readyRequets = [];
      myEstimate.forEach((esmimate) => {
        requests.forEach((request) => {
          if (esmimate.requestId === request.id) readyRequets.push(request);
        });
      });
      //번역가가 본인으로 확정된 번역 요청리스트
      const confirmedRequets = await requestRepository.getFilterByTranslatorId(
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
