const { Merchant } = require('../models');

class MerchantController {
    async getProfile(req, res) {
        try {
            const merchant = await Merchant.findByPk(req.params.id);
            if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
            res.json({ success: true, data: merchant });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const merchant = await Merchant.findByPk(req.params.id);
            if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
            await merchant.update(req.body);
            res.json({ success: true, data: merchant });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getStats(req, res) {
        try {
            const merchant = await Merchant.findByPk(req.params.id);
            if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
            // Return placeholder stats
            res.json({ success: true, data: { products: 0, orders: 0, revenue: 0 } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new MerchantController();
