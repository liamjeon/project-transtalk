const express = require("express");
const router = express.Router();
const { isAuthForClient } = require("../../middlewares/auth.middleware.js");

const RequestController = require("./request.controller.js");
const requestController = new RequestController();

//Todo
//isAuthForClient 추가

//번역 요청 작성
router.post("/", requestController.htmlCreateRequest);
//번역 요청 리스트
router.get("/list",  requestController.htmlGetRequestListById);
//견적 요청 리스트
router.get(
  "/list/:requestId",
  
  requestController.htmlGetEstimateByRequestId
);

module.exports = router;
