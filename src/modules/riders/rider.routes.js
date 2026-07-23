const { Router } = require('express');
const { z } = require('zod');
const router = Router();
const { riderService } = require('./rider.service');

const createSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  quartier: z.string().min(2),
  vehicle: z.string().optional().default('moto')
});

router.post('/', async (req,res)=>{
  try{ const data=createSchema.parse(req.body); const r=await riderService.create(data); res.status(201).json({ data:r }); }
  catch(e){ res.status(400).json({ error:e.message, details:e.errors }); }
});
router.get('/', async (req,res)=>{ const list=await riderService.list(req.query); res.json({ data:list }); });
router.get('/:id', async (req,res)=>{ const r=await riderService.getById(req.params.id); if(!r) return res.status(404).json({ error:'Not found' }); res.json({ data:r }); });
router.patch('/:id/status', async (req,res)=>{
  try{ const r=await riderService.setStatus(req.params.id, req.body.status); res.json({ data:r }); }
  catch(e){ res.status(400).json({ error:e.message }); }
});
router.post('/assign', async (req,res)=>{
  try{ const { orderId, riderId } = req.body; const result=await riderService.assignToOrder(orderId, riderId); res.json({ data:result }); }
  catch(e){ res.status(400).json({ error:e.message }); }
});
router.post('/complete', async (req,res)=>{
  try{ const { orderId } = req.body; const result=await riderService.completeDelivery(orderId); res.json({ data:result }); }
  catch(e){ res.status(400).json({ error:e.message }); }
});

module.exports = router;
