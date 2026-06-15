const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

mongoose.set('bufferCommands', false);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Middleware to ensure DB connection is ready before processing requests
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
    try {
      if (mongoose.connection.readyState === 2) {
        // Wait for the existing connection attempt to complete
        await new Promise((resolve) => {
          mongoose.connection.once('connected', resolve);
          mongoose.connection.once('error', resolve);
          setTimeout(resolve, 5000); // 5s safety timeout
        });
      } else {
        // Start connection if disconnected
        await mongoose.connect(process.env.MONGODB_URI);
      }
    } catch (err) {
      console.error('Database connection error in middleware:', err);
    }
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => res.send('AI Resume Builder API is running!'));
app.get('/health', (req, res) => res.json({ status: 'OK' }));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

