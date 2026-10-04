const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all Auth Login Route
app.all(['/api/auth/login', '/api/login', '/login'], (req, res) => {
    const { username } = req.body || {};
    if (username === 'admin') {
        return res.json({ success: true, redirect: 'admin-dashboard.html' });
    }
    return res.json({ success: true, redirect: 'customer-dashboard.html' });
});

// Serve Main Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Wildcard Route
app.get('*', (req, res) => {
    const requestedPath = path.join(__dirname, req.path);
    res.sendFile(requestedPath, (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'index.html'));
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
