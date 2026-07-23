const { Invoice } = require('../models');

class InvoiceController {
    async create(req, res) {
        try {
            const invoiceData = {
                ...req.body,
                merchantId: req.userId || req.body.merchantId
            };
            
            const invoice = await Invoice.create(invoiceData);
            res.status(201).json({ success: true, data: invoice });
        } catch (error) {
            console.error('Create invoice error:', error);
            res.status(500).json({ error: 'Failed to create invoice' });
        }
    }

    async list(req, res) {
        try {
            const invoices = await Invoice.findAll({
                where: { merchantId: req.query.merchantId || req.userId },
                order: [['createdAt', 'DESC']]
            });
            res.json({ success: true, data: invoices });
        } catch (error) {
            console.error('List invoices error:', error);
            res.status(500).json({ error: 'Failed to fetch invoices' });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const invoice = await Invoice.findOne({
                where: { 
                    id,
                    merchantId: req.query.merchantId || req.userId 
                }
            });
            
            if (!invoice) {
                return res.status(404).json({ error: 'Invoice not found' });
            }
            
            res.json({ success: true, data: invoice });
        } catch (error) {
            console.error('Get invoice error:', error);
            res.status(500).json({ error: 'Failed to fetch invoice' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const invoice = await Invoice.findOne({
                where: { 
                    id,
                    merchantId: req.query.merchantId || req.userId 
                }
            });
            
            if (!invoice) {
                return res.status(404).json({ error: 'Invoice not found' });
            }
            
            await invoice.update(req.body);
            res.json({ success: true, data: invoice });
        } catch (error) {
            console.error('Update invoice error:', error);
            res.status(500).json({ error: 'Failed to update invoice' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await Invoice.destroy({
                where: { 
                    id,
                    merchantId: req.query.merchantId || req.userId 
                }
            });
            
            if (result === 0) {
                return res.status(404).json({ error: 'Invoice not found' });
            }
            
            res.json({ success: true, message: 'Invoice deleted' });
        } catch (error) {
            console.error('Delete invoice error:', error);
            res.status(500).json({ error: 'Failed to delete invoice' });
        }
    }
}

module.exports = new InvoiceController();
