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

// Initialize Table & Seed Data
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

// Send OTP Route (Member Login 2-Step Verification)
app.post(['/api/auth/send-otp', '/api/send-otp'], (req, res) => {
    const { username } = req.body;
    res.json({ 
        success: true, 
        message: "OTP sent successfully to registered mobile", 
        otp: "123456" 
    });
});

// Verify OTP / Auth Login Route
app.post(['/api/auth/login', '/api/login', '/api/auth/verify-otp'], (req, res) => {
    const { username, password, otp, role } = req.body;

    // Admin Direct Login
    if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
        return res.json({
            success: true,
            message: "Admin Login Successful",
            redirect: "admin-dashboard.html",
            user: { username: 'admin', role: 'admin', name: 'System Admin' }
        });
    }

    // Member / User Login
    if (username === 'user1') {
        // If OTP provided, verify OTP '123456'
        if (otp && otp !== '123456') {
            return res.status(400).json({ success: false, message: "Incorrect OTP!" });
        }

        return res.json({
            success: true,
            message: "Member Login Successful",
            redirect: "customer-dashboard.html",
            user: { 
                username: 'user1', 
                role: 'member', 
                name: 'Darshan Dhavade', 
                account_no: 'MCB100123', 
                balance: 54250.00 
            }
        });
    }

    // Fallback DB Search
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            message: "Login Successful",
            redirect: user.role === 'admin' ? "admin-dashboard.html" : "customer-dashboard.html",
            user
        });
    });
});

// Serve Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback Route for HTML Pages & Static Files
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
