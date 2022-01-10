const express = require("express");
const router = express.Router();
const { isAuthForClient } = require("../../middlewares/auth.middleware.js");

const RequestController = require("./request.controller.js");
const requestController = new RequestController();

//번역 요청 작성
router.post("/", isAuthForClient, requestController.htmlCreateRequest);
//번역 요청 리스트
router.get("/list", isAuthForClient, requestController.htmlGetRequestListById);
//견적 요청 리스트
router.get(
  "/list/:requestId",
  isAuthForClient,
  requestController.htmlGetEstimateByRequestId
);

module.exports = router;
