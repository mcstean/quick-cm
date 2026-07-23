const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const { Merchant } = require('../merchants/merchant.model');
const { Product } = require('../products/product.model');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  client_name: { type: DataTypes.STRING, allowNull:false },
  client_phone: { type: DataTypes.STRING, allowNull:false },
  client_quartier: { type: DataTypes.STRING, allowNull:false },
  delivery_address: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue:'pending' },
  total: { type: DataTypes.FLOAT, defaultValue:0 },
  delivery_fee: { type: DataTypes.FLOAT, defaultValue:0 },
  notes: { type: DataTypes.TEXT },
  riderId: { type: DataTypes.UUID, allowNull:true }
}, { tableName:'orders', timestamps:true });

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  quantity: { type: DataTypes.INTEGER, defaultValue:1 },
  price: { type: DataTypes.FLOAT, allowNull:false },
  name: { type: DataTypes.STRING }
}, { tableName:'order_items', timestamps:true });

Merchant.hasMany(Order, { as:'orders', foreignKey:'merchantId' });
Order.belongsTo(Merchant, { foreignKey:'merchantId' });
Order.hasMany(OrderItem, { as:'items', foreignKey:'orderId', onDelete:'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey:'orderId' });
Product.hasMany(OrderItem, { foreignKey:'productId' });
OrderItem.belongsTo(Product, { foreignKey:'productId' });

module.exports = { Order, OrderItem };
