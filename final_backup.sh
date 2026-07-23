#!/bin/bash
set -e
cd ~/projects/quick-cm
DATE=$(date +%Y%m%d-%H%M)
echo "=== FINAL BACKUP v8 $DATE ==="
mkdir -p ~/backups
tar -czf ~/backups/FULL-FINAL-v8-$DATE.tar.gz --exclude=node_modules --exclude=.git HANDOFF_REPORT_v7.md FINAL_REPORT_v8.md public src server.js package.json .env 2>/dev/null || tar -czf ~/backups/FULL-FINAL-v8-$DATE.tar.gz --exclude=node_modules HANDOFF_REPORT_v7.md public src server.js package.json
node backup-db.js
ls -lh ~/backups/*v8* ~/backups/*$DATE* 2>/dev/null || ls -lh ~/backups/ | tail -n 20
echo "--- FINAL HEALTH ---"
curl -s http://localhost:3000/api/v2/health
echo ""
echo "Backup complete. Store ~/backups/ on external drive."
