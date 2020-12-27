'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'rooms',
      [
        {
          name: 'Room A',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Room B',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Room C',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Room D',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rooms', null, {});
  },
};
