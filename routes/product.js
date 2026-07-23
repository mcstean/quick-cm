module.exports = function(app) {
    app.get('/api/products', (req, res) => res.json({ success: true, data: [] }));
    app.post('/api/products', (req, res) => res.json({ success: true, message: 'Product created' }));
};
