const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

const Rider = sequelize.define('Rider', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull:false },
  phone: { type: DataTypes.STRING, allowNull:false, unique:true },
  quartier: { type: DataTypes.STRING, allowNull:false },
  status: { type: DataTypes.STRING, defaultValue:'available' },
  vehicle: { type: DataTypes.STRING, defaultValue:'moto' },
  total_deliveries: { type: DataTypes.INTEGER, defaultValue:0 }
}, { tableName:'riders', timestamps:true });

module.exports = { Rider };
