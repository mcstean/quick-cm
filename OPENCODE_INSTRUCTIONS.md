# OpenCode: Fix Quick.cm Server

## Current Issue
The server crashes with: "F.route is not a function"

## Fix Required
1. Change all routes from `F.route()` to `framework.route()`
2. Update server.js to pass `framework` to routes: `require('./routes/api.js')(framework)`
3. Ensure total4 is used correctly

## Files to Fix
- server.js
- routes/api.js
- routes/webhook.js
- routes/invoice.js
- routes/bot.js

## Goal
Server should run on port 3000 without errors.
`curl http://localhost:3000/api/health` should return OK.

## Once Server is Fixed
Build the complete API with all features from the project spec.
