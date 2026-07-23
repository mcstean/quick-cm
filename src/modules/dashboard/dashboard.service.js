const { Order } = require('../orders/order.model');
const { Rider } = require('../riders/rider.model');
const { Merchant } = require('../merchants/merchant.model');
const { Product } = require('../products/product.model');

async function overview({ merchantId, quartier }) {
  const { Op } = require('sequelize');
  const where = {};
  if (merchantId) where.merchantId = merchantId;
  const orders = await Order.findAll({ where });
  const merchants = await Merchant.count();
  const products = await Product.count(merchantId ? { where:{ merchantId } } : {});
  const riders = await Rider.findAll({ where: quartier ? { quartier } : {} });
  const total = orders.length;
  const pending = orders.filter(o=>o.status==='pending').length;
  const confirmed = orders.filter(o=>o.status==='confirmed').length;
  const delivering = orders.filter(o=>o.status==='delivering').length;
  const delivered = orders.filter(o=>o.status==='delivered').length;
  const revenue = orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+(o.total||0),0);
  return { merchants, products, riders, orders:{ total, pending, confirmed, delivering, delivered }, revenue };
}
module.exports = { overview };
