'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      User.hasMany(models.Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      User.belongsToMany(models.Role, { through: 'role_user', foreignKey: 'user_id', onDelete: 'CASCADE' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    contact: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
  });
  return User;
};