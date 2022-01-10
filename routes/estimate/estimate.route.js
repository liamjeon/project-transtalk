const express = require("express");
const router = express.Router();
const {
  isAuthForTranslaotr,
  isProfile,
} = require("../../middlewares/auth.middleware.js");

const EstimateController = require("./estimate.controller.js");
const estimateController = new EstimateController();

router.get(
  "/list",
  isAuthForTranslaotr,
  isProfile,
  estimateController.htmlGetRequestListByStatus
);
router.get(
  "/list/detail/:requestId",
  isAuthForTranslaotr,
  isProfile,
  estimateController.htmlGetRequestById
);
router.post(
  "/list/detail/:requestId",
  isAuthForTranslaotr,
  isProfile,
  estimateController.htmlCreateEstimate
);
router.get(
  "/mylist",
  isAuthForTranslaotr,
  isProfile,
  estimateController.htmlGetMyTransList
);

module.exports = router;
