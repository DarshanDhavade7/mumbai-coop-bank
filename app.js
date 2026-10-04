const express = require('express');
const path = require('path');
const authRoutes = require('./src/config/routes/authRoutes');
const customerRoutes = require('./src/config/routes/customerRoutes');
const adminRoutes = require('./src/config/routes/adminRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files from Public Directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;