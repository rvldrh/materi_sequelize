'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class borrow extends Model {
    static associate(models) {
      this.belongsTo(models.member, {
        foreignKey: 'memberID',
        as: 'member'
      });
      this.belongsTo(models.admin, {
        foreignKey: 'adminID',
        as: 'admin'
      });
      this.hasMany(models.details_of_borrow, {
        foreignKey: 'borrowID',
        as: 'details_of_borrow'
      });
    }
  };
  borrow.init({
    memberID: DataTypes.INTEGER,
    adminID: DataTypes.INTEGER,
    date_of_borrow: DataTypes.DATE,
    date_of_return: DataTypes.DATE,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'borrow',
  });
  return borrow;
};
