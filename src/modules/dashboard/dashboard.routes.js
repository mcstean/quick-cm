const { Router } = require('express');
const router = Router();
const { overview } = require('./dashboard.service');

router.get('/overview', async (req,res)=>{
  try { const data = await overview(req.query); res.json({ data }); }
  catch(e){ res.status(500).json({ error:e.message }); }
});

module.exports = router;
