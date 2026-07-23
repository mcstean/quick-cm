const { Referral } = require('../models');

class ReferralController {
    async generateCode(req, res) {
        try {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            const referral = await Referral.create({ ...req.body, code });
            res.json({ success: true, data: referral });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async validateCode(req, res) {
        try {
            const referral = await Referral.findOne({ where: { code: req.params.code } });
            if (!referral) return res.status(404).json({ error: 'Invalid referral code' });
            res.json({ success: true, data: referral });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async trackClick(req, res) {
        try {
            const referral = await Referral.findOne({ where: { code: req.params.code } });
            if (!referral) return res.status(404).json({ error: 'Referral not found' });
            await referral.increment('clicks');
            res.json({ success: true, message: 'Click tracked' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async trackConversion(req, res) {
        try {
            const referral = await Referral.findOne({ where: { code: req.params.code } });
            if (!referral) return res.status(404).json({ error: 'Referral not found' });
            await referral.increment('conversions');
            res.json({ success: true, message: 'Conversion tracked' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ReferralController();
