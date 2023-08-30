'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('variant_products', {
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'products',
          key: 'id',
        },
      },
      variant_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'variants',
          key: 'id',
        },
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('variant_products');
  }
};