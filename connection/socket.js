const { model, modelNames } = require("mongoose");
const SocketIO = require("socket.io");

let io;
function initSocket(server, app) {
  io = SocketIO(server, {
    cors: {
      origin: "*",
    },
  });
  const chat = io.of("/chat"); 

  let roomId;
  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스 연결!");

    socket.on("join-room", async (data) => {
      roomId = data.roomId;
      socket.join(roomId);
      getSocketIO().of("/chat").emit("join", `${roomId}번 번역요청 채팅 시작`);
      console.log(`${roomId}번 번역요청 채팅 시작`);
    });

    //chat 네임스페이스 종료 (채팅방에서 나갔을때)
    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제");
      socket.leave(roomId);
      getSocketIO().of("/chat").emit("exit", `${roomId}번 번역요청 채팅에서 나갔습니다.`);
      console.log(`${roomId}번 번역요청 채팅에서 나갔습니다.`);
    });
  });
}

function getSocketIO() {
  if (!io) {
    throw new Error("Please call init first");
  }
  return io;
}

module.exports = { initSocket, getSocketIO };
