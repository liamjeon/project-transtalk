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
      translatorId,
      totalTrans: 0, //초기화 0
      totalReviews: 0, //초기화 0
      totalPrice: 0, //초기화 0
      avgReviews: 0, //초기화 0
    });
  }

  async getByTranslatorId(translatorId) {
    return Profile.findOne({ where: { translatorId } });
  }

  async updateReviewInfo(translatorId, score) {
    let totalReviews = 0,
      avgReviews = 0;

    const profile = await Profile.findOne({ where: { translatorId } });
    totalReviews = profile.totalReviews + 1;
    //리뷰 평균 점수는 소숫점 첫째자리
    avgReviews = (
      (profile.avgReviews * profile.totalReviews + score) /
      (profile.totalReviews + 1)
    ).toFixed(1);

    return Profile.update(
      { totalReviews, avgReviews },
      { where: { translatorId } }
    );
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
    return Profile.findOne({ where: { translatorId } }).then((profile) => {
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

  async updateTotalTrans(translatorId) {
    const profile = await Profile.findOne({ where: { translatorId } });
    const addTotalTrans = profile.totalTrans + 1;

    return Profile.update(
      { totalTrans: addTotalTrans },
      { where: { id: profile.id } }
    );
  }
}

module.exports = ProfileRepository;
