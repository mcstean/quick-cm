module.exports = function(app) {
    app.post('/api/webhooks/momo', (req, res) => {
        console.log('📨 Webhook received:', req.body);
        res.json({ success: true, message: 'Webhook processed' });
    });
};
