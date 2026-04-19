const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──
app.use(cors({
  origin: '*',
credentials: false
}));
app.use(express.json());

// ── Routes ──
app.use('/api/listings', require('./routes/listings'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));

// ── Health check ──
app.get('/', (req, res) => res.json({ message: 'Breeze Travel API is running 🌍' }));

// ── Connect DB & Start ──
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB error:', err));
