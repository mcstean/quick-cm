require('dotenv').config();
module.exports.ENV = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://quickcm_user:quickcm123@localhost:5432/quickcm',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
