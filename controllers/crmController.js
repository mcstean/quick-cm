const { CRMLead } = require('../models');

class CRMController {
    async listLeads(req, res) {
        try {
            const leads = await CRMLead.findAll({ order: [['createdAt', 'DESC']] });
            res.json({ success: true, data: leads });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createLead(req, res) {
        try {
            const lead = await CRMLead.create(req.body);
            res.json({ success: true, data: lead });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateLeadStatus(req, res) {
        try {
            const lead = await CRMLead.findByPk(req.params.id);
            if (!lead) return res.status(404).json({ error: 'Lead not found' });
            await lead.update({ status: req.body.status, stage: req.body.stage });
            res.json({ success: true, data: lead });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async assignAgentToLead(req, res) {
        try {
            const lead = await CRMLead.findByPk(req.params.id);
            if (!lead) return res.status(404).json({ error: 'Lead not found' });
            await lead.update({ agentId: req.body.agentId });
            res.json({ success: true, data: lead });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getLeadDetails(req, res) {
        try {
            const lead = await CRMLead.findByPk(req.params.id);
            if (!lead) return res.status(404).json({ error: 'Lead not found' });
            res.json({ success: true, data: lead });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CRMController();
