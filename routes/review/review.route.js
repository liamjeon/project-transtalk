const express = require("express");
const router = express.Router();
const { isAuthForClient } = require("../../middlewares/auth.middleware.js");

const ReviewController = require("./review.controller.js");
const reviewController = new ReviewController();

router.post("/:requestId",isAuthForClient, reviewController.htmlCreateReview);
router.get("/:translatorId", reviewController.htmlGetReview);

module.exports = router;
