'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Estimate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Request, {foreignKey:'requestId'});
      this.belongsTo(models.User, {foreignKey:'translatorId'});
    }
  };
  Estimate.init({
    offerPrice: {
      type: DataTypes.INTEGER,
    },
    confirmedDate: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
    sendDate: {
      type: DataTypes.STRING,
    },
    confirmedDate: {
      type: DataTypes.STRING,
    },

  }, {
    sequelize,
    modelName: 'Estimate',
  });
  return Estimate;
};