const { Op } = require('sequelize');
const { Product } = require('./product.model');
const { Merchant } = require('../merchants/merchant.model');
const productService = {
  async search({ search, quartier, limit=50 }){
    const where={};
    if(search) where.name = { [Op.iLike]: `%${search}%` };
    if(quartier) where.quartier = { [Op.iLike]: `%${quartier}%` };
    return Product.findAll({ where, include:[{ model:Merchant }], limit, order:[['createdAt','DESC']] });
  }
};
module.exports = { productService };
