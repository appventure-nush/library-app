'use strict';

// Role {
//   STUDENT = 1,
//   TEACHER = 11,
//   LIBRARIAN = 12,
//   ADMIN = 100,
// }

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Eric',
          role: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'David',
          role: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Issac',
          role: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
