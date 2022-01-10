const jwt = require("jsonwebtoken");
const UserRepository = require('../routes/user/user.data.js');
const userRepository = new UserRepository();

const JWT_SECRETKEY = "transtalkJWT";

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  console.log(authHeader);

  if(!(authHeader && authHeader.startsWith('Bearer'))){
      return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];

  console.log(token);
  jwt.verify(token, JWT_SECRETKEY, async(error, decoded)=>{
      if(error){
        console.log(error);

          return res.sendStatus(401);
      }
      console.log(decoded.id);
      const user = await userRepository.getByKakaoId(decoded.id);
      if(!user){
          return res.status(401);
      }
      res.locals.user = user;
      next();
  })
};
