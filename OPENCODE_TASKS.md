# OpenCode Tasks for Quick.cm

## Priority 1: Fix Server
1. Fix routes to use `framework.route()` not `F.route()`
2. Update server.js to pass framework to routes
3. Get server running on port 3000

## Priority 2: Complete Backend
Create these missing files:

### Models
- [ ] Payment.js
- [ ] Referral.js
- [ ] Agent.js
- [ ] CRMLead.js
- [ ] Expense.js
- [ ] Account.js
- [ ] Transaction.js

### Controllers
- [ ] authController.js (JWT, bcrypt)
- [ ] merchantController.js (CRUD)
- [ ] productController.js (CRUD, bulk upload)
- [ ] paymentController.js (MTN/Orange)
- [ ] referralController.js
- [ ] agentController.js
- [ ] crmController.js

### Routes
- [ ] auth.js
- [ ] merchant.js
- [ ] product.js
- [ ] payment.js
- [ ] referral.js
- [ ] agent.js
- [ ] crm.js

### Middleware
- [ ] auth.js (JWT verification)
- [ ] validation.js (Input validation)

### Services
- [ ] email.js (nodemailer)
- [ ] pdf.js (pdfkit)
- [ ] payment.js (MTN/Orange)

## Priority 3: Configuration
- [ ] config/backend.json
- [ ] config/database.json
- [ ] config/integration.json

## Success Criteria
- [ ] Server runs without errors
- [ ] All API endpoints respond
- [ ] Database tables created
- [ ] Authentication works
