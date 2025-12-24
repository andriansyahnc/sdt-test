'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wish_sent_logs', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('birthday'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('sent', 'failed'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
    await queryInterface.addIndex('wish_sent_logs', ['userId']);
    await queryInterface.addIndex('wish_sent_logs', ['type']);
    await queryInterface.addIndex('wish_sent_logs', ['status']);
    await queryInterface.addIndex('wish_sent_logs', ['userId', 'type', 'createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('wish_sent_logs');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_wish_sent_logs_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_wish_sent_logs_status";');
  },
};
