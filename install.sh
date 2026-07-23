
#!/bin/bash
set -e
cd ~/projects/quick-cm
echo "Backing up old server.js -> server.js.bak.old"
cp server.js server.js.bak.old 2>/dev/null || true
echo "Copying new structure..."
cp -r /mnt/data/quick-cm-growable/src ./src
cp /mnt/data/quick-cm-growable/server.js ./server.js
echo "Installing deps..."
npm install zod
echo "Testing build..."
node --check server.js
pm2 delete quick-cm || true
pm2 start server.js --name "quick-cm" --cwd ~/projects/quick-cm
pm2 save
pm2 logs quick-cm --lines 30
