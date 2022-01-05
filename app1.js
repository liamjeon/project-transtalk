const express = require("express");
const cors = require("cors");
// const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const ColorHash = require('color-hash');

const webSocket = require("./socket.js");
const { sequelize } = require("./models/models");
const indexRouter = require("./routes/index.js");

dotenv.config();


async function startServer() {
  const app = express();

  //session
  const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  });

  //modules
  app.use(cors());
  app.use(express.json());
  // app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(helmet());
  app.use(morgan("tiny"));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(sessionMiddleware);
  app.use((req, res, next) => {
    if (!req.session.color) {
      // const colorHash = new ColorHash();
      // req.session.color = colorHash.hex(req.sessionID);
      req.session.color = "temp";
    }
    next();
  });

  //nunjucks
  app.set("view engine", "html");
  nunjucks.configure("views", {
    express: app,
    watch: true,
  });

  //routes
  app.use("/", indexRouter);

  //exeptions
  app.use((req, res, next) => {
    res.sendStatus(404);
  });
  app.use((error, req, res, next) => {
    res.sendStatus(500);
  });

  // server
  await sequelize.sync({
    force: false,
  });

  console.log("server is started!");
  const server = app.listen(8005);
  webSocket(server, app, sessionMiddleware);
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
