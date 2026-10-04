const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const dbPath = path.join(__dirname, 'bank.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error opening db:', err.message);
    else console.log('Connected to SQLite database.');
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            fullName TEXT NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'customer'
        )
    `);

    const defaultUsers = [
        { username: 'admin', fullName: 'System Admin', phone: '9876543210', password: 'admin123', role: 'admin' },
        { username: 'user1', fullName: 'Darshan Dhavade', phone: '9876543210', password: 'user123', role: 'customer' },
        { username: 'user2', fullName: 'Piyush Gade', phone: '9876543211', password: 'user123', role: 'customer' },
        { username: 'user3', fullName: 'Shrawan Palande', phone: '9876543212', password: 'user123', role: 'customer' },
        { username: 'user4', fullName: 'Saksham Berde', phone: '9876543213', password: 'user123', role: 'customer' }
    ];

    defaultUsers.forEach(u => {
        db.run(
            `INSERT OR IGNORE INTO users (username, fullName, phone, password, role) VALUES (?, ?, ?, ?, ?)`,
            [u.username, u.fullName, u.phone, u.password, u.role]
        );
    });
});

// Step 1: Username & Password Verification
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username & Password required' });

    db.get(`SELECT id, username, fullName, phone, role FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (row) {
            res.json({ message: 'Credentials verified. Proceed to OTP.', user: row });
        } else {
            res.status(401).json({ error: 'Invalid Username or Password!' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});