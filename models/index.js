const { sequelize } = require('../config/database');
const Merchant = require('./Merchant');
const Product = require('./Product');
const Invoice = require('./Invoice');
const Bot = require('./Bot');
const Payment = require('./Payment');
const Referral = require('./Referral');
const Agent = require('./Agent');
const CRMLead = require('./CRMLead');

// Define relationships
Merchant.hasMany(Product, { foreignKey: 'merchantId' });
Product.belongsTo(Merchant, { foreignKey: 'merchantId' });

Merchant.hasMany(Invoice, { foreignKey: 'merchantId' });
Invoice.belongsTo(Merchant, { foreignKey: 'merchantId' });

Merchant.hasOne(Bot, { foreignKey: 'merchantId' });
Bot.belongsTo(Merchant, { foreignKey: 'merchantId' });

Merchant.hasMany(Payment, { foreignKey: 'merchantId' });
Payment.belongsTo(Merchant, { foreignKey: 'merchantId' });

Merchant.hasMany(Referral, { foreignKey: 'merchantId' });
Referral.belongsTo(Merchant, { foreignKey: 'merchantId' });

Merchant.hasMany(Agent, { foreignKey: 'merchantId' });
Agent.belongsTo(Merchant, { foreignKey: 'merchantId' });

Merchant.hasMany(CRMLead, { foreignKey: 'merchantId' });
CRMLead.belongsTo(Merchant, { foreignKey: 'merchantId' });

Agent.hasMany(CRMLead, { foreignKey: 'agentId' });
CRMLead.belongsTo(Agent, { foreignKey: 'agentId' });

module.exports = {
    sequelize,
    Merchant,
    Product,
    Invoice,
    Bot,
    Payment,
    Referral,
    Agent,
    CRMLead
};
