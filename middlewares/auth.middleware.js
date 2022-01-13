const jwt = require("jsonwebtoken");
const UserRepository = require("../routes/user/user.data.js");
const userRepository = new UserRepository();
const ProfileRepository = require("../routes/profile/profile.data.js");
const profileRepository = new ProfileRepository();

const JWT_SECRETKEY = "transtalkJWT";

//클라이언트 로그인여부 확인
async function isAuthForClient(req, res, next) {
  const token = getToken(req.get("Authorization"));

  jwt.verify(token, JWT_SECRETKEY, async (error, decoded) => {
    if (error) {
      console.log(error);
      return res.sendStatus(401);
    }
    const user = await userRepository.getByKakaoId(decoded.id);
    if (!user) {
      return res.status(401).json({message: "로그인이 필요합니다"});
    }
    if (user.auth !== "client") {
      return res.status(403).json({ message: "클라이언트가 아닙니다." });
    }
    res.locals.user = user;
    next();
  });
}

//번역가 로그인여부 확인
async function isAuthForTranslaotr(req, res, next) {
  const token = getToken(req.get("Authorization"));

  jwt.verify(token, JWT_SECRETKEY, async (error, decoded) => {
    if (error) {
      console.log(error); 
    }
    const user = await userRepository.getByKakaoId(decoded.id);
    if (!user) {
      return res.status(401).json({message: "로그인이 필요합니다"});
    }
    console.log(user.id, user.auth);
    if (user.auth !== "translator") {
      return res.status(403).json({ message: "번역가가 아닙니다." });
    }
    if (user.approve === false) {
      return res.status(403).json({ message: "번역가 승인전 입니다." });
    }
    res.locals.user = user;
    next();
  });
}

//번역가&클라이언트 구분없는 로그인 여부 확인
async function isAuthBoth(req, res, next) {
  const token = getToken(req.get("Authorization"));

  jwt.verify(token, JWT_SECRETKEY, async (error, decoded) => {
    if (error) {
      console.log(error);
      return res.sendStatus(401);
    }
    const user = await userRepository.getByKakaoId(decoded.id);
    if (!user) {
      return res.status(401).json({message: "등록된 아이디가 없습니다."});
    }
    res.locals.user = user;
    next();
  });
}


function getToken(authHeader) {
  if (!(authHeader && authHeader.startsWith("Bearer"))) {
    return console.log('Token이 없습니다.');
  }
  return authHeader.split(" ")[1];
}

async function isProfile(req, res, next) {
  console.log('isProfile');
  const exProfile = await profileRepository.getByTranslatorId(
    res.locals.user.id
  );
  if (!exProfile) {
    return res.status(403).json({ message: "프로필을 작성해주세요." });
  }
  next();
}

module.exports = {
  isAuthBoth,
  isAuthForClient,
  isAuthForTranslaotr,
  isProfile,
};
