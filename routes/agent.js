module.exports = function(app) {
    app.post('/api/agents', (req, res) => res.json({ success: true, message: 'Agent registered' }));
    app.get('/api/agents/:id', (req, res) => res.json({ success: true, data: { id: req.params.id } }));
};
