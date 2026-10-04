const express = require('express');
const router = express.Router();
const db = require('../db');

// Get All Users (Admin Feature)
router.get('/users', (req, res) => {
    const query = `SELECT id, username, role, balance FROM users`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

module.exports = router;
