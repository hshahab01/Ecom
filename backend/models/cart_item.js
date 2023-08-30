'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      cart_item.belongsTo(models.Product, { foreignKey: 'product_id' });
      cart_item.belongsTo(models.Cart, { foreignKey: 'cart_id' });
      cart_item.belongsTo(models.Variant, { foreignKey: 'variant_id' });
    }
  }
  cart_item.init({
    quantity: DataTypes.INTEGER,
    cart_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    variant_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cart_item',
    underscored: true,
  });
  return cart_item;
};