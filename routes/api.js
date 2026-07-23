module.exports = function(app) {
    // Health check (redundant but safe)
    app.get('/api/health', (req, res) => {
        res.json({ 
            status: 'ok', 
            message: 'Quick.cm API is running',
            timestamp: new Date().toISOString()
        });
    });

    // Auth routes
    app.post('/api/auth/register', (req, res) => {
        res.json({ success: true, message: 'Registration endpoint' });
    });

    app.post('/api/auth/login', (req, res) => {
        res.json({ success: true, message: 'Login endpoint' });
    });
};
