'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('users', {
      fields: ['azureOid'],
      type: 'unique',
      name: 'unique_azureOid_on_users',
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('users', 'unique_azureOid_on_users');
  },
};
