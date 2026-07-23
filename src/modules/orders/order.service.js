const { Order, OrderItem } = require('./order.model');
const { Product } = require('../products/product.model');
const { Merchant } = require('../merchants/merchant.model');
const { notifyService } = require('../notifications/notify.service');
const { Rider } = require('../riders/rider.model');

function calcDeliveryFee(mq, cq){
  if(!mq || !cq) return 1000;
  return mq.toLowerCase().trim() === cq.toLowerCase().trim() ? 500 : 1500;
}

const orderService = {
  async create(payload){
    const { merchantId, client_name, client_phone, client_quartier, delivery_address, notes, items } = payload;
    if(!items || items.length===0) throw new Error('Order must have at least 1 item');
    const merchant = await Merchant.findByPk(merchantId);
    if(!merchant) throw new Error('Merchant not found');
    const productIds = items.map(i=>i.productId);
    const products = await Product.findAll({ where:{ id: productIds }});
    const map = new Map(products.map(p=>[p.id, p]));
    let subtotal=0;
    const orderItemsData=[];
    for(const it of items){
      const p = map.get(it.productId);
      if(!p) throw new Error(`Product ${it.productId} not found`);
      const qty = it.quantity||1;
      subtotal += (p.price||0)*qty;
      orderItemsData.push({ productId:p.id, quantity:qty, price:p.price, name:p.name });
    }
    const delivery_fee = calcDeliveryFee(merchant.quartier, client_quartier);
    const total = subtotal + delivery_fee;
    const order = await Order.create({ merchantId, client_name, client_phone, client_quartier, delivery_address, notes, total, delivery_fee, status:'pending' });
    for(const od of orderItemsData){ await OrderItem.create({ ...od, orderId:order.id }); }
    const full = await Order.findByPk(order.id, { include:[{ model: OrderItem, as:'items' }, { model: Merchant }] });
    notifyService.onOrderCreated(full).catch(()=>{});
    return full;
  },
  async list({ merchantId, status, riderId, limit=20 }){
    const where={};
    if(merchantId) where.merchantId=merchantId;
    if(status) where.status=status;
    if(riderId) where.riderId=riderId;
    return Order.findAll({ where, include:[{ model: OrderItem, as:'items' }, { model: Merchant }], order:[['createdAt','DESC']], limit });
  },
  async getById(id){ return Order.findByPk(id, { include:[{ model: OrderItem, as:'items' }, { model: Merchant }] }); },
  async updateStatus(id,status){
    const order = await Order.findByPk(id, { include:[{ model: OrderItem, as:'items' }] });
    if(!order) throw new Error('Order not found');
    order.status=status;
    await order.save();
    notifyService.onStatusChange(order).catch(()=>{});
    return order;
  }
};
module.exports = { orderService };
