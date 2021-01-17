'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'rooms',
      [
        {
          name: 'Lary 0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Lary 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Lemma 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Lemma 3',
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
