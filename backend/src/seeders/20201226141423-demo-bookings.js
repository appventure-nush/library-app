'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    var thisMonday = new Date();
    let day = thisMonday.getDay();
    thisMonday.setDate(thisMonday.getDate() - day + (day == 0 ? -6 : 1));
    await queryInterface.bulkInsert(
      'bookings',
      [
        {
          type: 1,
          userId: 1,
          roomId: 1,
          purpose: 'Project',
          details: 'CS Project',
          startTime: new Date(
            thisMonday.getFullYear(),
            thisMonday.getMonth(),
            thisMonday.getDate() + 1,
            11,
            30,
          ),
          endTime: new Date(
            thisMonday.getFullYear(),
            thisMonday.getMonth(),
            thisMonday.getDate() + 1,
            14,
            30,
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: 1,
          userId: 1,
          roomId: 2,
          purpose: 'Project',
          details: 'CS Project',
          startTime: new Date(
            thisMonday.getFullYear(),
            thisMonday.getMonth(),
            thisMonday.getDate() + 2,
            9,
            30,
          ),
          endTime: new Date(
            thisMonday.getFullYear(),
            thisMonday.getMonth(),
            thisMonday.getDate() + 2,
            12,
            30,
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: 1,
          userId: 1,
          roomId: 3,
          purpose: 'Project',
          details: 'CS Project',
          startTime: new Date(
            thisMonday.getFullYear(),
            thisMonday.getMonth(),
            thisMonday.getDate() + 3,
            15,
            30,
          ),
          endTime: new Date(
            thisMonday.getFullYear(),
            thisMonday.getMonth(),
            thisMonday.getDate() + 3,
            16,
            30,
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: 1,
          userId: 1,
          roomId: 4,
          purpose: 'Project',
          details: 'CS Project',
          startTime: new Date(
            thisMonday.getFullYear(),
            thisMonday.getMonth(),
            thisMonday.getDate(),
            9,
            30,
          ),
          endTime: new Date(
            thisMonday.getFullYear(),
            thisMonday.getMonth(),
            thisMonday.getDate(),
            11,
            30,
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bookings', null, {});
  },
};
