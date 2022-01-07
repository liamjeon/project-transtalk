const RequestRepository = require("./request.data.js");
const requestRepository = new RequestRepository();

class RequestController {
  async htmlCreateRequest(req, res, next) {
    // const clientId = req.locals.user.id;
    const clientId = 1; //임시
    try {
      const result = await requestRepository.create({
        status: "ready",
        field: req.body.field,
        beforeLanguage: req.body.beforeLanguage,
        afterLanguage: req.body.afterLanguage,
        deadline: req.body.deadline,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        fileUrl: req.body.fileUrl,
        needs: req.body.needs,
        isText: req.body.isText,
        clientId: 1,
      });
      return res.status(201).json(result);
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  async htmlGetRequestList(req, res, next) {
    try {
      //   const userId = req.locals.user.id;
      const userId = 1; //임시
      const result = await requestRepository.getByStatus(userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.sendStatus(404);
    }
  }

  //견적 리스트 클릭시 견적(Estimate) 리스트를 받아옴
  async htmlGetRequestById(req, res, next) {
    try {
      //   const userId = req.locals.user.id;
      console.log(req.params.requestId);
      const userId = 1; //임시
      const requestId = req.params.requestId;
      const result = await requestRepository.getById(requestId);
      return res.status(200).json(result);
    } catch (error) {
      return res.sendStatus(404);
    }
  }
}

module.exports = RequestController;
