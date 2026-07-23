module.exports = function(app) {
    app.get('/api/bots/:merchantId', (req, res) => res.json({ success: true, data: { name: 'Quick Bot' } }));
    app.post('/api/bots/:merchantId/chat', (req, res) => res.json({ success: true, reply: 'Hello!' }));
};
