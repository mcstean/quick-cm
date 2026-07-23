
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- Helper to load old MVP routes safely (won't crash if file missing) ---
function safeLoadRoute(path, name) {
  try {
    const fn = require(path);
    if (typeof fn === 'function') fn(app);
    console.log(`✅ Loaded route: ${name}`);
  } catch (e) {
    console.log(`⚠️  Skipped route ${name}: ${e.message}`);
  }
}

// Old MVP routes (your working ones)
safeLoadRoute('./routes/api', 'api');
safeLoadRoute('./routes/webhook', 'webhook');
safeLoadRoute('./routes/invoice', 'invoice');
safeLoadRoute('./routes/bot', 'bot');
safeLoadRoute('./routes/product', 'product');
safeLoadRoute('./routes/merchant', 'merchant');
safeLoadRoute('./routes/payment', 'payment');
safeLoadRoute('./routes/referral', 'referral');
safeLoadRoute('./routes/agent', 'agent');
safeLoadRoute('./routes/crm', 'crm');

// --- NEW Growable Modular API (v2) ---
try {
  const growableRoutes = require('./routes/growable');
  growableRoutes(app);
  console.log('✅ Growable v2 routes loaded at /api/v2');
} catch (e) {
  console.log('⚠️  Growable routes not found, run: tar -xzf quick-cm-growable-v4-old-db.tar.gz -C .');
  console.log(e.message);
}

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Quick.cm API running',
    old_health: '/api/health',
    new_health: '/api/v2/health',
    new_merchants: '/api/v2/merchants',
    new_products: '/api/v2/products'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found', path: req.path });
});

// Start
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
    app.listen(PORT, () => {
      console.log(`🚀 Quick.cm Server running on http://localhost:${PORT}`);
      console.log(`📊 Old Health: http://localhost:${PORT}/api/health`);
      console.log(`📊 New Health: http://localhost:${PORT}/api/v2/health`);
      console.log(`🌐 Frontend: http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
