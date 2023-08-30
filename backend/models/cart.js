'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.hasMany(models.cart_item, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
      Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Cart.init({
    count: DataTypes.INTEGER,
    total: DataTypes.DOUBLE,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
    underscored: true,
  });
  return Cart;
};