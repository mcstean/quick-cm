#!/bin/bash
echo "=== Verify all v7 modules on server ==="
cd ~/projects/quick-cm
for f in src/modules/merchants/merchant.model.js src/modules/products/product.model.js src/modules/orders/order.model.js src/modules/stats/stats.routes.js src/modules/riders/rider.model.js src/modules/notifications/notify.service.js src/modules/index.js; do
  if [ -f "$f" ]; then echo "✅ $f"; else echo "❌ MISSING $f"; fi
done
pm2 logs quick-cm --lines 5 --nostream
curl -s http://localhost:3000/api/v2/health
echo ""
