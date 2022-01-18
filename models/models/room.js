'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Chat, {foreignKey: "roomId"});
      this.belongsTo(models.Request, {foreignKey: "requestId"});
      this.belongsTo(models.Estimate, {foreignKey: "estimateId"});
    }
  };
  Room.init({
    lastChatDate:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    isReadClient:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isReadTranslator:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    requestId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};