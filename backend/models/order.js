'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.order_item, { foreignKey: 'order_id', onDelete: 'CASCADE' });
      Order.hasOne(models.Payment, { foreignKey: 'order_id', onDelete: 'CASCADE' });
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Order.init({
    status: DataTypes.STRING,
    subtotal: DataTypes.DOUBLE,
    tax: DataTypes.DOUBLE,
    total: DataTypes.DOUBLE,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
    underscored: true,
  });
  return Order;
};