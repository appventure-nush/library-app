'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'rooms',
      [
        {
          name: 'Lary 0',
          staffOnly: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Lary 1',
          staffOnly: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Lemma 2',
          staffOnly: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Lemma 3',
          staffOnly: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Electron',
          staffOnly: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Vivo',
          staffOnly: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Event Horizon',
          staffOnly: true,
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
