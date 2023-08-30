'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.belongsToMany(models.User, { through: 'role_user', foreignKey: 'role_id', onDelete: 'CASCADE' });
    }
  }
  Role.init({
    value: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Role',
    underscored: true,
  });
  return Role;
};