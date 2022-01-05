const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const { User } = require("../models/models");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback", //카카오로부터 인증결과를 받을 라우터
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(`accessToken: ${accessToken}`);
        console.log(`refreshToken: ${refreshToken}`);
        console.log(`profile.id: ${profile.id}`);
        console.log(
          `profile._json.kaccount_email : ${profile._json.kaccount_email}`
        );
        console.log(`profile.displayName : ${profile.displayName}`);
        try {
          console.log(`profile : ${profile}`);
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          
          if (exUser) {
            done(null, { userInfo: exUser, accessToken });
          } else {
            const newUser = await User.create({
              username: profile.displayName,
              snsId: profile.id,
              auth: "client",
              provider: "kakao",
            });
            done(null, { userInfo: newUser, accessToken });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
