const RoomRepository = require("./room.data.js");
const roomRepository = new RoomRepository();

class RoomController {
  async htmlCreate(req, res, next) {
    const requestId = req.params.requestId;
    try {
      const result = await roomRepository.create(requestId);
      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  async htmlGetAllForClient(req, res, next) {
    const clientId = res.locals.user.id;
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
