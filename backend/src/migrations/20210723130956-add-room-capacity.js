'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('rooms', 'capacity', {
      type: Sequelize.INTEGER,
      defaultValue: 5,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('rooms', 'capacity');
  },
};
