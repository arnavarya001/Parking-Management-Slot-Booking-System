const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Create a booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { slotId, startTime, endTime } = req.body;
    
    if (!slotId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide slot and times' });
    }

    const slot = await ParkingSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status === 'blocked') return res.status(400).json({ message: 'Slot is blocked' });

    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);

    if (newStartTime >= newEndTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      slot: slotId,
      status: 'active',
      $or: [
        { startTime: { $lt: newEndTime }, endTime: { $gt: newStartTime } }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Slot already booked for this time period' });
    }

    const newBooking = new Booking({
      user: req.user.id,
      slot: slotId,
      startTime: newStartTime,
      endTime: newEndTime
    });

    await newBooking.save();
    res.status(201).json(newBooking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Get my bookings
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('slot')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Cancel my booking
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all bookings
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('slot')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
