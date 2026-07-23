const { DataTypes } = require('sequelize');
// Use your OLD working sequelize instance that you just fixed
const { sequelize } = require('../../../config/database');
const Merchant = sequelize.define('Merchant', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull:false },
  slug: { type: DataTypes.STRING, unique:true },
  quartier: { type: DataTypes.STRING, allowNull:false },
  phone: { type: DataTypes.STRING, allowNull:false },
  address: { type: DataTypes.STRING },
}, { tableName:'merchants', timestamps:true });
Merchant.addHook('beforeSave', (m)=>{ if(m.name) m.slug = m.name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); });
module.exports = { Merchant };
