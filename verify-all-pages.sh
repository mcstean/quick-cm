#!/bin/bash
set -e
cd ~/projects/quick-cm
echo "=== Quick.cm FULL PAGE VERIFICATION v8 ==="
echo ""
echo "1. Frontend"
curl -s -o /dev/null -w "GET / -> %{http_code} %{size_download} bytes\n" http://localhost:3000/
echo ""

echo "2. Health Checks"
curl -s http://localhost:3000/api/v2/health | python3 -m json.tool
echo ""

echo "3. Merchants"
curl -s http://localhost:3000/api/v2/merchants | python3 -m json.tool | head -n 20
echo ""

echo "4. Products"
curl -s "http://localhost:3000/api/v2/products?merchantId=35cc694a-94d0-4457-8956-1fdfec82d962" | python3 -m json.tool | head -n 30
echo ""

echo "5. Orders"
curl -s "http://localhost:3000/api/v2/orders?merchantId=35cc694a-94d0-4457-8956-1fdfec82d962" | python3 -m json.tool | head -n 60
echo ""

echo "6. Riders"
curl -s http://localhost:3000/api/v2/riders | python3 -m json.tool
echo ""

echo "7. Stats"
curl -s "http://localhost:3000/api/v2/stats/overview?merchantId=35cc694a-94d0-4457-8956-1fdfec82d962" | python3 -m json.tool
echo ""

echo "8. Dashboard"
curl -s "http://localhost:3000/api/v2/dashboard/overview?merchantId=35cc694a-94d0-4457-8956-1fdfec82d962" | python3 -m json.tool | head -n 40
echo ""

echo "9. PM2 Status"
pm2 status
echo ""

echo "10. Logs"
pm2 logs quick-cm --lines 5 --nostream
echo ""

echo "11. Backups"
ls -lh ~/backups/ | tail -n 15
echo ""

echo "12. Files Check"
ls -lh public/index.html src/modules/index.js HANDOFF_REPORT_v7.md FINAL_REPORT_v8.md
echo ""
echo "=== VERIFICATION DONE ==="
