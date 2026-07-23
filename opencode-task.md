# OpenCode Task: Fix Quick.cm

## Current Issue
Server crashes with "framework.route is not a function"

## Solution
Switch from total4 to Express framework

## Files to Create/Update

### 1. server.js (Express version)
Use Express, CORS, and connect to PostgreSQL with Sequelize

### 2. routes/api.js
- GET /api/health - Health check
- POST /api/auth/register - User registration
- POST /api/auth/login - User login

### 3. routes/invoice.js
- GET /api/invoices - List invoices
- POST /api/invoices - Create invoice

### 4. routes/bot.js
- GET /api/bots/:merchantId - Get bot config
- POST /api/bots/:merchantId/chat - Chat with bot

### 5. models/index.js
Import all models and define relationships

## Goal
Server runs on port 3000 without errors
curl http://localhost:3000/api/health returns {"status":"ok"}
