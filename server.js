// server.js - Express server for baseball player profile
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.static('public'));

// Default data
const defaultData = {
    playerData: {
        name: 'Mike Trout',
        position: 'CF',
        team: 'Los Angeles Angels',
        number: '27',
        height: '6\'2"',
        weight: '235 lbs',
        birthDate: 'August 7, 1991',
        hometown: 'Vineland, NJ',
        bats: 'R',
        throws: 'R',
        profilePhoto: 'https://via.placeholder.com/300x400/1f4e79/ffffff?text=Player+Photo'
    },
    battingStats: {
        games: 140,
        atBats: 523,
        runs: 104,
        hits: 159,
        doubles: 32,
        triples: 2,
        homeRuns: 40,
        rbi: 95,
        walks: 78,
        strikeouts: 128,
        stolenBases: 20,
        caughtStealing: 3,
        battingAvg: '.304',
        onBasePerc: '.390',
        sluggingPerc: '.585',
        ops: '.975'
    },
    pitchingStats: {
        games: 0,
        wins: 0,
        losses: 0,
        saves: 0,
        inningsPitched: '0.0',
        hits: 0,
        runs: 0,
        earnedRuns: 0,
        walks: 0,
        strikeouts: 0,
        homeRuns: 0,
        era: '0.00',
        whip: '0.00'
    },
    fieldingStats: {
        games: 138,
        putouts: 378,
        assists: 12,
        errors: 3,
        doublePlays: 4,
        fieldingPerc: '.992'
    },
    sprayCharts: [],
    hypeVideos: [],
    theme: {
        primaryColor: '#1f4e79',
        secondaryColor: '#c41e3a',
        accentColor: '#ffffff',
        backgroundColor: '#f8f9fa'
    }
};

// Default admin credentials
const defaultAuth = {
    adminExists: false,
    adminEmail: 'admin@baseball.com',
    adminPassword: 'admin123'
};

const DATA_FILE = 'data.json';
const AUTH_FILE = 'auth.json';

// Initialize data files if they don't exist
function initializeFiles() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
        console.log('Created default data.json file');
    }
    
    if (!fs.existsSync(AUTH_FILE)) {
        fs.writeFileSync(AUTH_FILE, JSON.stringify(defaultAuth, null, 2));
        console.log('Created default auth.json file');
    }
}

// Read data from file
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return defaultData;
    }
}

// Write data to file
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
}

// Read auth from file
function readAuth() {
    try {
        const auth = fs.readFileSync(AUTH_FILE, 'utf8');
        return JSON.parse(auth);
    } catch (error) {
        console.error('Error reading auth file:', error);
        return defaultAuth;
    }
}

// Write auth to file
function writeAuth(auth) {
    try {
        fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing auth file:', error);
        return false;
    }
}

// API Routes

// Get all data
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// Save all data
app.post('/api/data', (req, res) => {
    const success = writeData(req.body);
    if (success) {
        res.json({ success: true, message: 'Data saved successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to save data' });
    }
});

// Get auth info
app.get('/api/auth', (req, res) => {
    const auth = readAuth();
    // Don't send the password, just whether admin exists
    res.json({ adminExists: auth.adminExists });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const auth = readAuth();
    
    if (email === auth.adminEmail && password === auth.adminPassword) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Register admin
app.post('/api/auth/register', (req, res) => {
    const { email, password, registrationCode } = req.body;
    
    if (registrationCode !== 'BASEBALL2025') {
        return res.status(400).json({ success: false, message: 'Invalid registration code' });
    }
    
    const auth = readAuth();
    auth.adminExists = true;
    auth.adminEmail = email;
    auth.adminPassword = password;
    
    const success = writeAuth(auth);
    if (success) {
        res.json({ success: true, message: 'Admin registered successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to register admin' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
initializeFiles();
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Baseball Player Profile server running on port ${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
    console.log(`Auth file: ${AUTH_FILE}`);
});