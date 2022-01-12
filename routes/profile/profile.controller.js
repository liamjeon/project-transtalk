const ProfileRepository = require("./profile.data.js");
const profileRepository = new ProfileRepository();

class ProfileController {
  async htmlCreateProfile(req, res, next) {
    const translatorId = res.locals.user.id;
    const {
      name,
      career,
      language,
      profileUrl,
      introduce,
      taxPossible,
      cashPossible,
      isBusiness,
    } = req.body;

    try {
      const exProfile = await profileRepository.getByTranslatorId(translatorId);
      console.log(exProfile);
      if (exProfile) {
        return res
          .status(403)
          .json({ message: "이미 프로필을 등록하였습니다." });
      }

      const result = await profileRepository.create(
        name,
        career,
        language,
        profileUrl,
        introduce,
        taxPossible,
        cashPossible,
        isBusiness,
        translatorId
      );
      return res.status(201).json({ data: result });
    } catch (error) {
      return res.status(404); 
    }
  }

  async htmlGetProfile(req, res, next) {
    const translatorId = res.locals.user.id;

    try {
      const result = await profileRepository.getByTranslatorId(translatorId);
      return res.status(201).json({ data: result });
    } catch (error) {
      return res.status(404).json(error);
    }
  }

  async htmlUpdateProfile(req, res, next) {
    const translatorId = res.locals.user.id;
    const {
      name,
      career,
      language,
      profileUrl,
      introduce,
      taxPossible,
      cashPossible,
      isBusiness,
    } = req.body;
    try {
      const result = await profileRepository.updateByTranslatorId(
        translatorId,
        name,
        career,
        language,
        profileUrl,
        introduce,
        taxPossible,
        cashPossible,
        isBusiness
      );
      return res.status(201).json({ data: result });
    } catch (error) {
      return res.status(404).json(error);
    }
  }
}

module.exports = ProfileController;
