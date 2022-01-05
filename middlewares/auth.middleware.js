//isAuthenticated : passport가 req에 추가한 메서드

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    console.log(req.user.info.id);
    res.status(401).send(`로그인한 상태입니다. 아이디: ${req.user.info.id}`);
  }
}