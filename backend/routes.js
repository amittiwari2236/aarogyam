const express = require('express');
const router = express.Router();
const { appendToSheet } = require('./googleSheets');

// In-memory or temporary JSON substitute for user DB
const users = [];

// Signup Route
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    
    res.status(201).json({ message: 'User registered successfully', user: { name: newUser.name, email: newUser.email } });
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
});

// Booking Route
router.post('/book', async (req, res) => {
    const { name, email, phone, age, yogaType, date, time } = req.body;

    if (!name || !email || !phone || !date || !time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const createdAt = new Date().toLocaleString();
    // Putting new fields at the very end to NOT ruin the existing structure
    const rowValues = [name, email, phone, date, time, createdAt, age || 'N/A', yogaType || 'N/A'];

    try {
        await appendToSheet(rowValues);
        res.status(200).json({ message: 'Booking successful! Your session is confirmed.' });
    } catch (error) {
        console.error('Error in /book route:', error);
        res.status(500).json({ error: 'Failed to save booking to Google Sheets' });
    }
});

module.exports = router;
