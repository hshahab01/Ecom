'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      order_item.belongsTo(models.Product, { foreignKey: 'product_id' });
      order_item.belongsTo(models.Order, { foreignKey: 'order_id' });
      order_item.belongsTo(models.Variant, { foreignKey: 'variant_id' });
    }
  }
  order_item.init({
    quantity: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    variant_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'order_item',
    underscored: true,
  });
  return order_item;
};