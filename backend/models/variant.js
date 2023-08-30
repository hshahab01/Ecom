'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Variant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Variant.belongsToMany(models.Product, { through: 'variant_product', foreignKey: 'variant_id', onDelete: 'CASCADE' });
    }
  }
  Variant.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Variant',
    underscored: true,
  });
  return Variant;
};