const express = require('express');
const router = express.Router();
const isAuth = require('../../middlewares/auth.middleware.js');

const RequestController = require('./request.controller.js');
const requestController = new RequestController();


router.post('/',isAuth, requestController.htmlCreateRequest);
router.get('/list',isAuth, requestController.htmlGetRequestListById);
router.get('/list/:requestId',isAuth, requestController.htmlGetEstimateByRequestId);

module.exports = router;

