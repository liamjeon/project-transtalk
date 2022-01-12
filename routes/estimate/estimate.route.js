const express = require("express");
const router = express.Router();
const {
  isAuthForTranslaotr,
  isProfile,
} = require("../../middlewares/auth.middleware.js");

const EstimateController = require("./estimate.controller.js");
const estimateController = new EstimateController();

//번역 견적 작성
router.post(
  "/list/detail/:requestId",
  isAuthForTranslaotr,
  isProfile,
  estimateController.htmlCreateEstimate
);

//번역 요청 리스트
router.get(
  "/list",
  isAuthForTranslaotr,
  isProfile,
  estimateController.htmlGetRequestListByStatus
);

//번역 요청 상세
router.get(
  "/list/detail/:requestId",
  isAuthForTranslaotr,
  isProfile,
  estimateController.htmlGetRequestById
);

//내가 견적 보낸 번역 요청 리스트
router.get(
  "/mylist",
  isAuthForTranslaotr,
  isProfile,
  estimateController.htmlGetMyTransList
);


module.exports = router;
