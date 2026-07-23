const { Payment } = require('../models');

class PaymentController {
    async initiatePayment(req, res) {
        try {
            const payment = await Payment.create(req.body);
            res.json({ success: true, data: payment, message: 'Payment initiated' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async handleWebhook(req, res) {
        try {
            const { reference, status } = req.body;
            const payment = await Payment.findOne({ where: { reference } });
            if (!payment) return res.status(404).json({ error: 'Payment not found' });
            await payment.update({ status });
            res.json({ success: true, message: 'Webhook processed' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPaymentStatus(req, res) {
        try {
            const payment = await Payment.findByPk(req.params.id);
            if (!payment) return res.status(404).json({ error: 'Payment not found' });
            res.json({ success: true, data: payment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async listPayments(req, res) {
        try {
            const payments = await Payment.findAll({ order: [['createdAt', 'DESC']] });
            res.json({ success: true, data: payments });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();
