'use strict'

module.exports = {
  up: async (queryInterface, _) => {
    const timestamp = new Date()

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'admin',
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        id: 2,
        username: 'james',
        created_at: timestamp,
        updated_at: timestamp,
      },
    ])
  },
  down: (queryInterface, Sequelize) => {},
}
