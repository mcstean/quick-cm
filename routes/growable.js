const growableRouter = require('../src/modules');
module.exports = function(app){
  app.use('/api/v2', growableRouter);
  app.use('/api/growable', growableRouter);
};
