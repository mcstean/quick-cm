const { Op } = require('sequelize');
const { Merchant } = require('./merchant.model');
const { Product } = require('../products/product.model');
const merchantService = {
  async list({ search, quartier, limit=20 }){
    const where={};
    if(quartier) where.quartier = { [Op.iLike]: `%${quartier}%` };
    if(search) where.name = { [Op.iLike]: `%${search}%` };
    return Merchant.findAll({ where, include:[{ model:Product, as:'products' }], limit, order:[['createdAt','DESC']] });
  },
  async getBySlug(slug){ return Merchant.findOne({ where:{ slug }, include:[{ model:Product, as:'products' }] }); },
  async create({ name, quartier, phone, address, products=[] }){
    const merchant = await Merchant.create({ name, quartier, phone, address });
    if(products && products.length>0){
      const bulk = products.map(p=> ({ ...p, merchantId: merchant.id, quartier: p.quartier||quartier }));
      const { Product } = require('../products/product.model');
      await Product.bulkCreate(bulk);
    }
    return Merchant.findByPk(merchant.id, { include:[{ model:Product, as:'products' }] });
  }
};
module.exports = { merchantService };
