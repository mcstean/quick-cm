const { Router } = require('express');
const router = Router();
const { productService } = require('./product.service');
router.get('/', async (req,res)=>{
  try { const data = await productService.search(req.query); res.json({ data }); }
  catch(e){ res.status(500).json({ error:e.message }); }
});
module.exports = router;
