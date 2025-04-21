const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ticketingtool', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql', // or 'postgres', 'sqlite', etc.
  logging: false,   // disable logging if you want
});

module.exports = sequelize;
