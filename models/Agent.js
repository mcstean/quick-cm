const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Agent = sequelize.define('Agent', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    merchantId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    commissionRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 10 },
    totalSales: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    commissionEarned: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    leads: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

module.exports = Agent;
