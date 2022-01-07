'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TranslatorProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {foreignKey: 'userId'});
    }
  };
  TranslatorProfile.init({
    name: {
      type: DataTypes.STRING,
    },
    career: {
      type: DataTypes.STRING,
    },
    profileUrl: {
      type: DataTypes.STRING,
    },
    language: {
      type: DataTypes.STRING,
    },
    introduce: {
      type: DataTypes.STRING,
    },
    totalTrans: {
      type: DataTypes.INTEGER,
    },
    totalReviews: {
      type: DataTypes.INTEGER,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
    },
    avgReviews: {
      type: DataTypes.INTEGER,
    },
    taxPossible: {
      type: DataTypes.BOOLEAN,
    },
    cashPossible: {
      type: DataTypes.BOOLEAN,
    },
    isBusiness: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    sequelize,
    modelName: 'TranslatorProfile',
  });
  return TranslatorProfile;
};