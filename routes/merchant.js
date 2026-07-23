module.exports = function(app) {
    app.get('/api/merchants/:id', (req, res) => res.json({ success: true, data: { id: req.params.id } }));
    app.put('/api/merchants/:id', (req, res) => res.json({ success: true, message: 'Merchant updated' }));
};
