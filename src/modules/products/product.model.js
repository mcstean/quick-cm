const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const { Merchant } = require('../merchants/merchant.model');
const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull:false },
  price: { type: DataTypes.FLOAT, defaultValue:0 },
  quartier: { type: DataTypes.STRING },
  in_stock: { type: DataTypes.BOOLEAN, defaultValue:true },
}, { tableName:'products', timestamps:true });
Merchant.hasMany(Product, { as:'products', foreignKey:'merchantId', onDelete:'CASCADE' });
Product.belongsTo(Merchant, { foreignKey:'merchantId' });
module.exports = { Product };
