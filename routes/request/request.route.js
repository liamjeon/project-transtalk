const express = require("express");
const router = express.Router();
const { isAuthForClient } = require("../../middlewares/auth.middleware.js");

const RequestController = require("./request.controller.js");
const requestController = new RequestController();

router.post("/", isAuthForClient, requestController.htmlCreateRequest);
router.get("/list", isAuthForClient, requestController.htmlGetRequestListById);
router.get(
  "/list/:requestId",
  isAuthForClient,
  requestController.htmlGetEstimateByRequestId
);

module.exports = router;
