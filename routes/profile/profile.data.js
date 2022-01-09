const { Profile } = require("../../models/models");

class ProfileRepository {
  async create(
    name,
    career,
    language,
    profileUrl,
    introduce,
    taxPossible,
    cashPossible,
    isBusiness,
    translatorId
  ) {
    return Profile.create({
      name,
      career,
      language,
      profileUrl,
      introduce,
      taxPossible,
      cashPossible,
      isBusiness,
      translatorId
    });
  }

  async getByTranslatorId(translatorId) {
    return Profile.findOne({ where: { translatorId } });
  }

  async updateByTranslatorId(
    translatorId,
    name,
    career,
    language,
    profileUrl,
    introduce,
    taxPossible,
    cashPossible,
    isBusiness
  ) {
    return Profile.findOne({ where: { translatorId }}).then((profile) => {
      profile.name = name;
      profile.career = career;
      profile.language = language;
      profile.profileUrl = profileUrl;
      profile.introduce = introduce;
      profile.taxPossible = taxPossible;
      profile.cashPossible = cashPossible;
      profile.isBusiness = isBusiness;
      return profile.save();
    });
  }
}

module.exports = ProfileRepository;