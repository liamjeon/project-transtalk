const RoomRepository = require("./room.data.js");
const RequestRepository = require("../request/request.data.js");
const EstimateRepository = require("../estimate/estimate.data.js");
const ProfileRepository = require("../profile/profile.data.js");
const room = require('../../models/models/room.js');
const requestRepository = new RequestRepository();
const roomRepository = new RoomRepository();
const estimateRepository = new EstimateRepository();
const profileRepository = new ProfileRepository();

class RoomController {
  async htmlCreate(req, res, next) {
    // const requestId = req.params.requestId;
    const estimateId = req.params.estimateId;
    try {
      console.log(estimateId);
      const exEstimate = await estimateRepository.getById(estimateId);
      if (!exEstimate) {
        return res
          .status(403)
          .json({ messgae: "해당하는 견적 요청이 없습니다." });
      }

      const exRoom = await roomRepository.getByEstimateId(estimateId);
      if (exRoom) {
        return res
          .status(403)
          .json({ messgae: "이미 생성된 채팅방이 있습니다." });
      }
      const result = await roomRepository.create(
        estimateId,
        exEstimate.requestId
      );

      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  async htmlGetAllForClient(req, res, next) {
    const clientId = res.locals.user.id;
    try {
      const rooms = await roomRepository.getByClientId(clientId);
      // const room = rooms[0].dataValues;
      // const translatorId = rooms[0].Estimate.dataValues.translatorId;
      // const profile = await profileRepository.getByTranslatorId(translatorId);

      let result = [];
      for(let i=0; i<rooms.length; i++){
        let room = rooms[i];
        let translatorId = room.dataValues.Estimate.dataValues.translatorId;
        let profile = await profileRepository.getByTranslatorId(translatorId);

        result.push({
          id: room.id,
          lastChatDate: room.lastChatDate,
          isReadClient: room.isReadClient,
          isReadTranslator: room.isReadTranslator,
          requestId: room.requestId,
          createdAt: room.createdAt,
          estimateId: room.estimateId,
          translatorName: profile.dataValues.name,
        });
      }
      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  async htmlGetAllForTranslator(req, res, next) {
    const translatorId = res.locals.user.id;
    console.log(translatorId);
    try {
      const result = await roomRepository.getByTranslatorId(translatorId);
      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
}

module.exports = RoomController;
