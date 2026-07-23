const { Router } = require('express');
const { z } = require('zod');
const router = Router();
const { merchantService } = require('./merchant.service');
const createSchema = z.object({
  name: z.string().min(2),
  quartier: z.string().min(2),
  phone: z.string().min(9),
  address: z.string().optional(),
  products: z.array(z.object({ name: z.string(), price: z.number().optional(), quartier: z.string().optional(), in_stock: z.boolean().optional() })).optional()
});
router.get('/', async (req,res)=>{
  try { const data = await merchantService.list(req.query); res.json({ data }); }
  catch(e){ res.status(500).json({ error:e.message }); }
});
router.get('/:slug', async (req,res)=>{
  const m = await merchantService.getBySlug(req.params.slug);
  if(!m) return res.status(404).json({ error:'Not found' });
  res.json({ data: m });
});
router.post('/', async (req,res)=>{
  try {
    const parsed = createSchema.parse(req.body);
    const merchant = await merchantService.create(parsed);
    res.status(201).json({ data: merchant });
  } catch(e){ res.status(400).json({ error: e.message, details: e.errors || e }); }
});
module.exports = router;
