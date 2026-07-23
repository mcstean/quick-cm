const { z } = require('zod');
const validate = (schema) => (req,res,next)=>{
  try { schema.parse({ body:req.body, query:req.query, params:req.params }); next(); }
  catch(e){ return res.status(400).json({ error:'Validation failed', details:e.errors }); }
};
module.exports = { validate };
