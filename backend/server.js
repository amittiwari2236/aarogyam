const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api', apiRoutes);

// Fallback to index.html for undefined routes (useful if SPA approach taken later)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running accurately on http://localhost:${PORT}`);
});
