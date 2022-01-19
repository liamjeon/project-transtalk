const express = require("express");
const router = express.Router();
const {
  isAuthForClient,
  isAuthForTranslaotr,
} = require("../../middlewares/auth.middleware.js");

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
  requestController.htmlGetAllEstimateByRequestId
);
//견적 상세 정보
router.get(
  "/list/:requestId/:estimateId",
  isAuthForClient,
  requestController.htmlGetEstimateByRequestId
);
//번역가 확정하기
router.post(
  "/list/:requestId/:estimateId",
  isAuthForClient,
  requestController.htmlconfirmTranslator
);

//번역 작업완료,  번역요청 상태를 done으로 변경
router.post(
  "/status/:requestId",
  isAuthForTranslaotr,
  requestController.htmlUpdateStatusToDone
);

module.exports = router;
