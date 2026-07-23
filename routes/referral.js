module.exports = function(app) {
    app.get('/api/referrals/:code', (req, res) => res.json({ success: true, data: { code: req.params.code } }));
    app.post('/api/referrals', (req, res) => res.json({ success: true, message: 'Referral created' }));
};
