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

// Database Setup
const dbPath = path.join(__dirname, 'bank.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Table Initialization with Real Names & Balances
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

    db.run(`INSERT OR IGNORE INTO users (username, password, role, name, account_no, balance) 
            VALUES ('user1', '123456', 'member', 'Darshan Dhavade', 'MCB100123', 54250.00)`);

    db.run(`INSERT OR IGNORE INTO users (username, password, role, name, account_no, balance) 
            VALUES ('admin', 'admin123', 'admin', 'System Admin', 'MCB000001', 0.00)`);
});

// Login API with User Details and OTP verification support
app.post(['/api/auth/login', '/api/login'], (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            return res.json({ success: false, message: "Database error" });
        }
        if (!row) {
            return res.json({ success: false, message: "Invalid username or password" });
        }

        // Successful login returns role and redirect path
        const redirectPage = row.role === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html';
        res.json({
            success: true,
            message: "Login Successful",
            redirect: redirectPage,
            user: {
                name: row.name,
                account_no: row.account_no,
                balance: row.balance,
                role: row.role
            }
        });
    });
});

// Root Route
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
