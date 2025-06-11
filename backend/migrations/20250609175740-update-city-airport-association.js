'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
      DELETE FROM Airports 
      WHERE cityId NOT IN (SELECT id FROM Cities)
    `);
    

    await queryInterface.addConstraint('Airports', {
      type: 'FOREIGN KEY',
      fields: ['cityId'],
      name: 'city_fkey_constraint', 
      references: {
        table: 'Cities', 
        field: 'id'
      },
      onDelete: 'CASCADE',

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Airports', 'city_fkey_constraint');
  }
};