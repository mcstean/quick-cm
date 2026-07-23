require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE_URL || 'postgres://quickcm_user:quickcm123@localhost:5432/quickcm',
    { dialect: 'postgres', logging: false }
);
module.exports = { sequelize };
