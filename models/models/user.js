'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Request, {foreignKey: 'clientId'});
      this.hasOne(models.Profile, {foreignKey: 'translatorId'});
      this.hasMany(models.Estimate, {foreignKey: 'translatorId'});
      this.hasMany(models.Review, {foreignKey: 'translatorId'});
    }
  };
  User.init({
    username: {
      type : DataTypes.STRING,
      allowNull : false,
    },
    snsId: {
      type : DataTypes.STRING,
      allowNull : false,
      unique: true,
    },
    auth: {
      type : DataTypes.STRING,
      allowNull : false,
    },
    provider:{
      type : DataTypes.STRING,
      allowNull : false,
    },
    approve:{
      type : DataTypes.BOOLEAN,
      allowNull : false,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};