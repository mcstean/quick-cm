const { Agent } = require('../models');

class AgentController {
    async registerAgent(req, res) {
        try {
            const agent = await Agent.create(req.body);
            res.json({ success: true, data: agent });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAgentProfile(req, res) {
        try {
            const agent = await Agent.findByPk(req.params.id);
            if (!agent) return res.status(404).json({ error: 'Agent not found' });
            res.json({ success: true, data: agent });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCommission(req, res) {
        try {
            const agent = await Agent.findByPk(req.params.id);
            if (!agent) return res.status(404).json({ error: 'Agent not found' });
            await agent.update({ commissionRate: req.body.commissionRate });
            res.json({ success: true, data: agent });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async listAgents(req, res) {
        try {
            const agents = await Agent.findAll();
            res.json({ success: true, data: agents });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AgentController();
