const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const redis = require("redis");
const { sequelize } = require("./models/models");
const userRouter = require("./routes/user/user.route.js");
const requestRouter = require('./routes/request/request.route.js');
const estimateRouter = require('./routes/estimate/estimate.route.js');
const profileRouter = require('./routes/profile/profile.route.js');

dotenv.config();

async function startServer() {
  const app = express();

  //moduels
  // passportConfig();
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cors());

  //라우터
  app.use("/auth", userRouter);
  app.use("/api/request", requestRouter);
  app.use("/api/estimate", estimateRouter);
  app.use("/api/translator", profileRouter);

  //예외 처리
  app.use((req, res, next) => {
    const error = `${req.method} ${req.url} 라우터가 없습니다`;
    res.status(404).json(error);
  });
  app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
  });

  //Server
  await sequelize.sync({
    force: false,
  });

  console.log("Server is started!");
  const server = app.listen(3000);
  return server;
}

async function stopServer(server) {
  return new Promise((resolve, reject) => {
    server.close(async () => {
      try {
        await sequelize.close();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

exports.startServer = startServer;
exports.stopServer = stopServer;
