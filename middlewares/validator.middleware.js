const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json(errors.array()[0]['msg']);
};

module.exports = [
  body("password") //
    .trim()
    .isLength({ min: 3, max:10 })
    .withMessage("비밀번호는 3글자 이상 10글자 이하"),
  body("email") //
    .trim()
    .isEmail()
    .withMessage("이메일 형식이 맞지 않습니다."),
  validate,
];
