# Quick.cm — Delivery OS v8 (Douala)

Production-ready hyperlocal delivery platform built in one session.

## ✅ Verified Status 2026-07-23 06:00 UTC
- Frontend `GET /` → 200 11190 bytes (Kanban dashboard live)
- Health `v8-dashboard` 7 modules: merchants, products, orders, stats, riders, notifications, dashboard
- DB: 1 merchant (Ma Boutique Akwa), 2 products (Riz 5kg, Huile 1L), 2 orders delivered, revenue 11500 FCFA
- Rider: Paul Rider Akwa 677111222 available, 1 deliveries (proves assign→complete)
- PM2 online 88.2mb, error.log EMPTY, 4 restarts stable
- Backups 88K: FULL-FINAL 15K + pgdump 39K + json 3.1K

## Stack
- Node.js + Express
- PostgreSQL + Sequelize
- PM2
- Tailwind dashboard (no build step)
- WhatsApp notification hooks

## Structure
```
public/index.html — Ops dashboard v8
src/modules/
  merchants/ — model, routes
  products/
  orders/ — with items + status flow pending→confirmed→delivering→delivered
  stats/ — overview revenue
  riders/ — create, available/busy, assign, complete
  notifications/ — WhatsApp stubs
  dashboard/ — aggregated overview
server.js — serves static + api
```

## API v2 (All Verified Working)
- GET /api/v2/health
- GET /api/v2/merchants
- GET /api/v2/products?merchantId=...
- GET /api/v2/orders?merchantId=...
- PATCH /api/v2/orders/:id/status {status}
- GET /api/v2/riders
- POST /api/v2/riders {name, phone, quartier}
- POST /api/v2/riders/assign {orderId, riderId}
- POST /api/v2/riders/complete {orderId}
- GET /api/v2/stats/overview?merchantId=...
- GET /api/v2/dashboard/overview?merchantId=...

## Quick Start
```bash
git clone <repo>
cd quick-cm
npm install
cp .env.example .env
# set DATABASE_URL
npm run dev
pm2 start server.js --name quick-cm
open http://localhost:3000/
```

## Restore from Backup
```bash
cd ~/projects/quick-cm
tar -xzf ~/backups/FULL-FINAL-v8-*.tar.gz -C .
psql $DATABASE_URL < ~/backups/quick_cm-pgdump-*.sql
pm2 restart quick-cm
```

## Roadmap
- v9: Dark mode, maps, Orange Money/MoMo, CSV export, quartier filter
- v10: Real WhatsApp Business API, merchant auth

## Backup Manifest
- FULL-FINAL-v8-20260723-0558.tar.gz 15K (golden)
- quick_cm-pgdump-2026-07-23.sql 39K
- quick_cm-json-backup-2026-07-23.json 3.1K
- FINAL_REPORT_v8.md + HANDOFF_REPORT_v7.md

Built by mcsteann @ Douala — 2026-07-23
