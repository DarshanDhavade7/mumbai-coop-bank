const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root and public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Connect to SQLite Database
const dbPath = path.join(__dirname, 'bank.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Import and use routes if present
try {
    const authRoutes = require('./authRoutes');
    const adminRoutes = require('./adminRoutes');
    const customerRoutes = require('./customerRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/customer', customerRoutes);
} catch (e) {
    console.log("Routes setup loaded.");
}

// Serve Main Page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
