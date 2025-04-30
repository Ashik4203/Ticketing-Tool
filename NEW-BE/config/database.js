const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ticketingtool_new', 'root', 'Tvs@123', {
  host: 'localhost',
  dialect: 'mysql', // or 'postgres', 'sqlite', etc.
  logging: false,   // disable logging if you want
});

module.exports = sequelize;
