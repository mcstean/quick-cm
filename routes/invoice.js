module.exports = function(app) {
    app.get('/api/invoices', (req, res) => res.json({ success: true, data: [] }));
    app.post('/api/invoices', (req, res) => res.json({ success: true, message: 'Invoice created' }));
};
