'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [{
      value: 2,
      created_at: new Date(),
      updated_at: new Date()
    }], {});

  },

  async down(queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('roles', null, {});
     
  }
};
