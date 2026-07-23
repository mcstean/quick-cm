const { Sequelize } = require('sequelize');
const { ENV } = require('./env');
const sequelize = new Sequelize(ENV.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
});
module.exports = { sequelize };
