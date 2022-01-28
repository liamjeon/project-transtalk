'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Estimate, {foreignKey:'requestId'});
      this.belongsTo(models.User, {foreignKey: 'clientId'});
      this.hasOne(models.Review, {foreignKey: 'requestId'});
      this.hasOne(models.Room, {foreignKey: 'requestId'});
    }
  };
  Request.init({
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    field: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    beforeLanguage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    afterLanguage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmedTranslator: { //확정된 번역가 이름
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmedDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmedPrice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    needs: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    youtubeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isText: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    translatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

  }, {
    sequelize,
    modelName: 'Request',
  });
  return Request;
};