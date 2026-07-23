const { Merchant } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {
    async register(req, res) {
        try {
            const { email, password, businessName, phoneNumber } = req.body;
            
            const existing = await Merchant.findOne({ where: { email } });
            if (existing) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            
            const merchant = await Merchant.create({ email, password, businessName, phoneNumber });
            const token = jwt.sign({ id: merchant.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
            
            res.status(201).json({ success: true, token, merchant: { id: merchant.id, email, businessName } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const merchant = await Merchant.findOne({ where: { email } });
            
            if (!merchant || !(await merchant.comparePassword(password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const token = jwt.sign({ id: merchant.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
            res.json({ success: true, token, merchant: { id: merchant.id, email, businessName: merchant.businessName } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async verifyToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.merchant = await Merchant.findByPk(decoded.id);
            next();
        } catch {
            res.status(401).json({ error: 'Invalid token' });
        }
    }
}

module.exports = new AuthController();
