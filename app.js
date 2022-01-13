const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const redis = require("redis");
const nunjucks = require("nunjucks");
const { sequelize } = require("./models/models");
const { expressCspHeader, INLINE, SELF } = require("express-csp-header");
// const { initSocket } = require("./connection/socket_module.js");
const { initSocket } = require("./connection/socket.js");
const indexRouter = require('./routes/index.js');

//

dotenv.config();

async function startServer() {
  const app = express();

  const corsOption = {
    credentials: true, //header에 Access_Controal-Allow-Credentials을 허락함
  };
  //Moduels
  app.use(express.json());
  app.use(helmet());
  app.use(cors(corsOption));
  app.use(morgan("dev"));
  app.set("view engine", "html");
  nunjucks.configure("views", {
    express: app,
    watch: true,
  });
  app.use(express.static(path.join(__dirname, "public")));
  app.use(
    //Content Security Policy 해결
    expressCspHeader({
      directives: {
        "script-src": [
          SELF,
          INLINE,
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com",
        ],
      },
    })
  );

  //Router
  app.use("/api", indexRouter);

  //Exception
  app.use((req, res, next) => {
    const error = `${req.method} ${req.url} 라우터가 존재하지 않습니다.`;
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
  const server = app.listen(process.env.PORT);
  // initSocket(server); //Socket 초기화
  initSocket(server, app);

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
