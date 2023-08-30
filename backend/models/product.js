'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.cart_item, { foreignKey: 'product_id', onDelete: 'CASCADE' });
      Product.belongsToMany(models.Variant, { through: 'variant_product', foreignKey: 'product_id', onDelete: 'CASCADE' });
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    underscored: true,
  });
  return Product;
};