'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class variant_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  variant_product.init({
    product_id: DataTypes.INTEGER,
    variant_id: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'variant_product',
    underscored: true,
  });
  return variant_product;
};