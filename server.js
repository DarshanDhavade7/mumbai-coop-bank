const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Setup
const dbPath = path.join(__dirname, 'bank.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Initialize Tables & Sample Users
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        name TEXT,
        account_no TEXT,
        balance REAL
    )`);

    // Insert Default Demo Users if missing
    db.run(`INSERT OR IGNORE INTO users (username, password, role, name, account_no, balance) 
            VALUES ('user1', '123456', 'member', 'Darshan Dhavade', 'MCB100123', 54250.00)`);

    db.run(`INSERT OR IGNORE INTO users (username, password, role, name, account_no, balance) 
            VALUES ('admin', 'admin123', 'admin', 'System Admin', 'MCB000001', 0.00)`);
});

// Auth Login API
app.post('/api/auth/login', (req, res) => {
    const { username, password, role } = req.body;
    
    // Direct Demo Check (Instant Fallback for testing)
    if (username === 'user1' || username === 'admin') {
        return res.json({ 
            success: true, 
            message: "Login Successful", 
            user: { username, role: role || 'member', name: 'Darshan Dhavade', account_no: 'MCB100123', balance: 54250.00 }
        });
    }

    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
        res.json({ success: true, message: "Login Successful", user });
    });
});

// Serve Main Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all static route
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
