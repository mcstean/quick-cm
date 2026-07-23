const { Rider } = require('./rider.model');
const { Order } = require('../orders/order.model');

const riderService = {
  async create(data){ return Rider.create(data); },
  async list({ quartier, status }){
    const where={};
    if(quartier) where.quartier=quartier;
    if(status) where.status=status;
    return Rider.findAll({ where, order:[['total_deliveries','DESC']] });
  },
  async getById(id){ return Rider.findByPk(id); },
  async setStatus(id,status){
    const r = await Rider.findByPk(id);
    if(!r) throw new Error('Rider not found');
    r.status=status; await r.save(); return r;
  },
  async assignToOrder(orderId, riderId){
    const order = await Order.findByPk(orderId);
    if(!order) throw new Error('Order not found');
    const rider = await Rider.findByPk(riderId);
    if(!rider) throw new Error('Rider not found');
    if(rider.status!=='available') throw new Error('Rider not available');
    order.riderId = rider.id;
    order.status = 'delivering';
    await order.save();
    rider.status='busy'; await rider.save();
    return { order, rider };
  },
  async completeDelivery(orderId){
    const order = await Order.findByPk(orderId);
    if(!order) throw new Error('Order not found');
    const rider = order.riderId ? await Rider.findByPk(order.riderId) : null;
    order.status='delivered';
    await order.save();
    if(rider){
      rider.status='available';
      rider.total_deliveries+=1;
      await rider.save();
    }
    return { order, rider };
  }
};

module.exports = { riderService };
