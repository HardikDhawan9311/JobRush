const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const initDb = require('./config/initDb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Database and Start Server
(async () => {
  try {
    // Auto-create database and tables
    await initDb();
    
    // Test pool connection
    await db.query('SELECT 1');
    console.log('MySQL Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Initialization failed:', err.message);
    process.exit(1);
  }
})();

app.use(cors({
  origin: true, // Reflects the request origin, allows any domain including Vercel
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const path = require('path');

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/jobs', require('./routes/jobRoutes'));

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Job Rush API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

