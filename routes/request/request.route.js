const express = require('express');
const router = express.Router();


const RequestController = require('./request.controller.js');
const requestController = new RequestController();

router.post('/', requestController.htmlCreateRequest);
router.get('/list', requestController.htmlGetRequestListById);
router.get('/list/:requestId', requestController.htmlGetEstimateByRequestId);

module.exports = router;

