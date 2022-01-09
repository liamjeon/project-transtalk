const express = require('express');
const router = express.Router();

const EstimateController = require('./estimate.controller.js');
const estimateController = new EstimateController();

router.get('/list', estimateController.htmlGetRequestListByStatus);
router.get('/list/detail/:requestId',estimateController.htmlGetRequestById);
router.post('/list/detail/:requestId', estimateController.htmlCreateEstimate);
router.get('/mylist', estimateController.htmlGetMyTransList);

module.exports = router;

