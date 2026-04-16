const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const rootDir = path.join(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const frontendIndexPath = path.join(frontendDir, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexPath) && fs.statSync(frontendIndexPath).size > 0;
const staticDir = hasFrontendBuild ? frontendDir : rootDir;

const allowedOrigins = new Set([
    `http://localhost:${PORT}`,
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501'
]);

const corsOptions = {
    origin(origin, callback) {
        // Allow non-browser clients and file:// previews that send a null origin.
        if (!origin || origin === 'null' || allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
};

// Middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Static Files (Frontend)
app.use(express.static(staticDir));

// Routes
app.use('/api', apiRoutes);

// Fallback to index.html for undefined routes (useful if SPA approach taken later)
app.use((req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running accurately on http://localhost:${PORT}`);
});
