const express = require('express');
const router = express.Router();
const db = require('../db');

// Get Customer Profile & Balance
router.get('/profile/:id', (req, res) => {
    const userId = req.params.id;
    const query = `SELECT id, username, balance FROM users WHERE id = ?`;

    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

module.exports = router;