const { getSocketIO } = require("../../connection/socket.js");
const ChatRepository = require("./chat.data.js");
const RoomRepository = require("../room/room.data.js");
const chatRepository = new ChatRepository();
const roomRepository = new RoomRepository();

class ChatController {
  async htmlCreate(req, res, next) {
    const userId = res.locals.user.id;
    const roomId = req.params.roomId;
    const { chat } = req.body;
    try {
      const exRoom = await roomRepository.getById(roomId);
      if(!exRoom){
        return res.status(400).json({message:"채팅방이 존재하지 않습니다."})
      }

      const result = await chatRepository.create(userId, chat, roomId);
      //소켓 통신
      getSocketIO().of("/chat").to(roomId).emit("add-chat", result.dataValues);

      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(400);
    }
  }

  async htmlGetAll(req, res, next) {
    const roomId = req.params.roomId;
    try {
      const exRoom = await roomRepository.getById(roomId);
      if(!exRoom){
        return res.status(400).json({message:"채팅방이 존재하지 않습니다."})
      }

      const result = await chatRepository.getByRoomId(roomId);

      // return res.render("basic", { data: result });
      return res.status(201).json({ data: result });
    } catch (error) {
      return res.sendStatus(400);
    }
  }
}

module.exports = ChatController;
