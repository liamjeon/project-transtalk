const express = require("express");
const path = require("path");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const morgan = require("morgan");
const passportConfig = require("./passport/index.js");
const { sequelize } = require("./models/models");
const userRouter = require("./routes/user/user.route.js");

dotenv.config();

async function startServer() {
  const app = express();

  //moduels
  passportConfig();
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    })
  );
  app.use(passport.initialize()); //req 에 passport 설정 넣음
  app.use(passport.session()); //req.session에 passport 정보 저장, passport.deserializeUser 호출

  //라우터
  app.use("/auth", userRouter);
  app.use("/", (req, res, next) => {
    // console.log(req.user.info);
    // console.log(req.user.accessToken);
  });

  //예외 처리
  app.use((req, res, next) => {
    res.sendStatus(404);
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