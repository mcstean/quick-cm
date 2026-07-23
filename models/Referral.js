const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Referral = sequelize.define('Referral', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    merchantId: { type: DataTypes.UUID, allowNull: false },
    referrerId: { type: DataTypes.UUID, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    clicks: { type: DataTypes.INTEGER, defaultValue: 0 },
    conversions: { type: DataTypes.INTEGER, defaultValue: 0 },
    rewards: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    expiresAt: { type: DataTypes.DATE }
}, { timestamps: true });

module.exports = Referral;
