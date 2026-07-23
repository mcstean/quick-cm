module.exports = function(app) {
    app.get('/api/crm/leads', (req, res) => res.json({ success: true, data: [] }));
    app.post('/api/crm/leads', (req, res) => res.json({ success: true, message: 'Lead created' }));
};
