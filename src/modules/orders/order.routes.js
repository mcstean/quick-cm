const { Router } = require('express');
const { z } = require('zod');
const router = Router();
const { orderService } = require('./order.service');

const createSchema = z.object({
  merchantId: z.string().uuid(),
  client_name: z.string().min(2),
  client_phone: z.string().min(9),
  client_quartier: z.string().min(2),
  delivery_address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).default(1)
  })).min(1)
});

router.post('/', async (req,res)=>{
  try {
    const data = createSchema.parse(req.body);
    const order = await orderService.create(data);
    res.status(201).json({ data: order });
  } catch(e){
    res.status(400).json({ error: e.message, details: e.errors || e });
  }
});

router.get('/', async (req,res)=>{
  try {
    const data = await orderService.list(req.query);
    res.json({ data });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

router.get('/:id', async (req,res)=>{
  const order = await orderService.getById(req.params.id);
  if(!order) return res.status(404).json({ error:'Order not found' });
  res.json({ data: order });
});

router.patch('/:id/status', async (req,res)=>{
  try {
    const { status } = req.body;
    const allowed = ['pending','confirmed','preparing','delivering','delivered','cancelled'];
    if(!allowed.includes(status)) return res.status(400).json({ error:'Invalid status' });
    const order = await orderService.updateStatus(req.params.id, status);
    res.json({ data: order });
  } catch(e){ res.status(400).json({ error:e.message }); }
});

module.exports = router;
