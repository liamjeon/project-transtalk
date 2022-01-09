'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {foreignKey: 'translatorId'});
    }
  };
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    career: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileUrl: {
      type: DataTypes.STRING,
      // allowNull: false,
    },  
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    introduce: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: false,
    },
    cashPossible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isBusiness: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};