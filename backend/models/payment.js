'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.Order, { foreignKey: 'order_id' });
    }
  }
  Payment.init({
    order_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Payment',
    underscored: true,
  });
  return Payment;
};