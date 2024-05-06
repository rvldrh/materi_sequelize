'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class details_of_borrow extends Model {
    static associate(models) {
      this.belongsTo(models.borrow, {
        foreignKey: 'borrowID',
        as: 'borrow'
      });
      this.belongsTo(models.book, {
        foreignKey: 'bookID',
        as: 'book'
      });
    }
  };
  details_of_borrow.init({
    borrowID: DataTypes.INTEGER,
    bookID: DataTypes.INTEGER,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'details_of_borrow',
  });
  return details_of_borrow;
};
