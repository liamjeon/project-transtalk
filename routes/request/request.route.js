const express = require("express");
const router = express.Router();
const { isAuthForClient, isAuthForTranslaotr } = require("../../middlewares/auth.middleware.js");

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
  requestController.htmlGetAllEstimateByRequestId
);
//견적 상세 정보
router.get(
  "/list/:requestId/:estimateId",
  requestController.htmlGetEstimateByRequestId
);

//번역 작업완료,  번역요청 상태를 done으로 변경 
router.post(
  "/status/:requestId",
  isAuthForTranslaotr,
  // isProfile,
  requestController.htmlUpdateStatusToDone
);


module.exports = router;
