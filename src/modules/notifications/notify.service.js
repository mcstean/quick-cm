const notifyService = {
  async sendWhatsApp(phone, message){
    // Plug to your existing bot if available
    try{
      // Try to use existing bot module if it exposes send
      const botPath = '../../../routes/bot';
      const bot = require(botPath);
      if(bot && typeof bot.sendMessage === 'function'){
        await bot.sendMessage(phone, message);
      }
    }catch(e){ /* bot not compatible, fallback to log */ }
    console.log(`[WHATSAPP -> ${phone}]: ${message}`);
    return true;
  },
  async onOrderCreated(order){
    const merchantMsg = `🛒 NEW ORDER #${order.id.slice(0,8).toUpperCase()}
Client: ${order.client_name} (${order.client_quartier})
Total: ${order.total} FCFA (fee ${order.delivery_fee})
Items: ${order.items?.map(i=>i.quantity+'x '+i.name).join(', ')}
Address: ${order.delivery_address}
Confirm: PATCH /api/v2/orders/${order.id}/status {"status":"confirmed"}`;
    const clientMsg = `✅ Quick.cm: Commande recue! #${order.id.slice(0,8).toUpperCase()} Total ${order.total}F. Boutique ${order.Merchant?.name||''} prepare votre commande.`;
    console.log(`[WHATSAPP NOTIFY MERCHANT ${order.merchantId}]:`, merchantMsg);
    console.log(`[WHATSAPP NOTIFY CLIENT ${order.client_phone}]:`, clientMsg);
    await this.sendWhatsApp(order.client_phone, clientMsg);
    return { merchantMsg, clientMsg };
  },
  async onStatusChange(order){
    const msgs = {
      confirmed: `📦 Votre commande #${order.id.slice(0,8)} est CONFIRMEE! Preparation en cours.`,
      preparing: `👨‍🍳 Commande #${order.id.slice(0,8)} en preparation.`,
      delivering: `🛵 Commande #${order.id.slice(0,8)} en livraison! Rider en route vers ${order.delivery_address}`,
      delivered: `🎉 Livree! Merci d'avoir utilise Quick.cm. Donnez une note!`,
      cancelled: `❌ Commande #${order.id.slice(0,8)} annulee. Contact support si besoin.`
    };
    const msg = msgs[order.status] || `📦 Order ${order.id.slice(0,8)} -> ${order.status}`;
    console.log(`[WHATSAPP CLIENT ${order.client_phone}]: ${msg}`);
    if(order.riderId) console.log(`[WHATSAPP RIDER ${order.riderId}]: ${msg}`);
    await this.sendWhatsApp(order.client_phone, msg);
    return msg;
  },
  async onRiderAssigned(order, rider){
    const msgRider = `🛵 Nouvelle livraison! Order #${order.id.slice(0,8)} -> ${order.delivery_address} (${order.client_quartier}) Client ${order.client_phone}`;
    const msgClient = `🛵 Rider ${rider.name} (${rider.phone}) assigne a votre commande #${order.id.slice(0,8)}. Il arrive!`;
    console.log(`[WHATSAPP RIDER ${rider.phone}]: ${msgRider}`);
    console.log(`[WHATSAPP CLIENT ${order.client_phone}]: ${msgClient}`);
    await this.sendWhatsApp(rider.phone, msgRider);
    await this.sendWhatsApp(order.client_phone, msgClient);
  }
};
module.exports = { notifyService };
