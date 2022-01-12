const RoomRepository = require("./room.data.js");
const RequestRepository = require('../request/request.data.js');
const requestRepository = new RequestRepository();
const roomRepository = new RoomRepository();


class RoomController {
  async htmlCreate(req, res, next) {
    const requestId = req.params.requestId;
    const clientId = res.locals.user.id;
    // console.log(clientId);
    try {
      const request = await requestRepository.getById(requestId);
      if(request.clientId != clientId){
        return res.status(403).json({messgae:"해당 번역요청 소유자가 아닙니다."});
      }
      const exRoom = await roomRepository.getByRequestId(requestId);
      if(exRoom){
        return res.status(400).json({messgae:"이미 생성된 채팅방이 있습니다."});
      }
      const result = await roomRepository.create(requestId);
      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  async htmlGetAllForClient(req, res, next) {
    const clientId = res.locals.user.id;
    console.log(clientId);
    try {
      const result = await roomRepository.getByClientId(clientId);
      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  async htmlGetAllForTranslator(req, res, next) {
    const translatorId = res.locals.user.id;
    try {
      const result = await roomRepository.getByTranslatorId(translatorId);
      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
}

module.exports = RoomController;
