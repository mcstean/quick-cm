const { Router } = require('express');
const { Order } = require('../orders/order.model');
const { Merchant } = require('../merchants/merchant.model');
const { Product } = require('../products/product.model');
const router = Router();

router.get('/overview', async (req,res)=>{
  try{
    const { merchantId, quartier } = req.query;
    const where = {};
    if(merchantId) where.merchantId = merchantId;
    if(quartier) where.client_quartier = quartier;

    const totalOrders = await Order.count({ where });
    const pending = await Order.count({ where:{...where, status:'pending'} });
    const confirmed = await Order.count({ where:{...where, status:'confirmed'} });
    const delivering = await Order.count({ where:{...where, status:'delivering'} });
    const delivered = await Order.count({ where:{...where, status:'delivered'} });
    const merchants = await Merchant.count();
    const products = await Product.count();
    const revenueRaw = await Order.sum('total', { where:{...where, status:['confirmed','preparing','delivering','delivered']} });
    
    res.json({
      data:{
        merchants, products,
        orders:{ total: totalOrders, pending, confirmed, delivering, delivered },
        revenue: revenueRaw||0,
        quartier: quartier||'all'
      }
    });
  }catch(e){ res.status(500).json({ error:e.message }); }
});

module.exports = router;
