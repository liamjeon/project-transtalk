const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

//Socket class는 내부에서만 사용( export 안함)
class Socket {
  constructor(server) {
    //this.io에 소켓을 만들 준비
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    //io에 token 을 검증한다. 로그인한 사람들한테만 트윗을 알려주고싶음
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      jwt.verify(
        token,
        "F2dN7x8HVzBWaQuEEDnhsvHXRWqAR63z",
        (error, decoded) => {
          if (error) {
            //error를 던지고 더이상 소켓이 처리되지 않도록함
            return next(new Error("Authentication error"));
          }
          next();
        }
      );
    });
    //on을 통해 connection이 연결되었는지 확인
    this.io.on("connection", (socket) => {
      console.log("Socket client connected");
    });
  }
}

let socket;
function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
    console.log("Socket 초기화");
  }
}
function getSocketIO() {
  if (!socket) {
    throw new Error("Please call init first");
  }
  return socket.io;
}

module.exports = {
  initSocket,
  getSocketIO,
};
