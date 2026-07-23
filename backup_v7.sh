#!/bin/bash
set -e
cd ~/projects/quick-cm
DATE=$(date +%Y%m%d-%H%M)
echo "=== Quick.cm Backup v7 $DATE ==="
mkdir -p ~/backups

# Code
tar -czf ~/backups/quick-cm-code-v7-$DATE.tar.gz --exclude=node_modules --exclude=.git src server.js package.json .env 2>/dev/null || tar -czf ~/backups/quick-cm-code-v7-$DATE.tar.gz --exclude=node_modules src server.js package.json

# DB try both roles
sudo -u postgres pg_dump quick_cm > ~/backups/quick_cm-db-v7-$DATE.sql 2>/dev/null || pg_dump quick_cm > ~/backups/quick_cm-db-v7-$DATE.sql 2>/dev/null || echo "DB dump needs postgres password"

# Env
cp .env ~/backups/env-$DATE.txt 2>/dev/null || true

ls -lh ~/backups/*$DATE*
echo "--- HEALTH ---"
curl -s http://localhost:3000/api/v2/health
echo ""
curl -s http://localhost:3000/api/v2/stats/overview?merchantId=35cc694a-94d0-4457-8956-1fdfec82d962 | python3 -m json.tool
echo "Backup done in ~/backups/"
