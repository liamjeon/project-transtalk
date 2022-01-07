'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transrequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Transrequest.init({
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
    confirmedTranslaotr: {
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
      type: DataTypes.STRING,
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

  }, {
    sequelize,
    modelName: 'Transrequest',
  });
  return Transrequest;
};