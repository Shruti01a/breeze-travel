const express = require('express');
const router  = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const auth    = require('../middleware/auth');

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights < 1) return res.status(400).json({ message: 'Invalid dates' });
    const totalPrice = nights * listing.price;
    const booking = await Booking.create({ listing: listingId, user: req.user.id, checkIn, checkOut, guests, totalPrice });
    await booking.populate('listing', 'title location image price');
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get my bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('listing', 'title location image price category')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
