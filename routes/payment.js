module.exports = function(app) {
    app.post('/api/payments', (req, res) => res.json({ success: true, message: 'Payment initiated' }));
    app.get('/api/payments', (req, res) => res.json({ success: true, data: [] }));
};
