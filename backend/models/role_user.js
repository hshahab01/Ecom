'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  role_user.init({
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'role_user',
    underscored: true,
  });
  return role_user;
};