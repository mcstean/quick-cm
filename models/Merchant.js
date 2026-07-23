const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Merchant = sequelize.define('Merchant', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    businessName: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });
module.exports = Merchant;
