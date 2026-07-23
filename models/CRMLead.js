const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CRMLead = sequelize.define('CRMLead', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    merchantId: { type: DataTypes.UUID, allowNull: false },
    agentId: { type: DataTypes.UUID, allowNull: true },
    customerName: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING, allowNull: false },
    customerEmail: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('new', 'contacted', 'qualified', 'closed'), defaultValue: 'new' },
    stage: { type: DataTypes.ENUM('cold', 'warm', 'hot', 'closed'), defaultValue: 'cold' },
    notes: { type: DataTypes.TEXT },
    assignedTo: { type: DataTypes.UUID }
}, { timestamps: true });

module.exports = CRMLead;
