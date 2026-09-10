const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all slots (can be filtered)
router.get('/', async (req, res) => {
  try {
    const { location, type } = req.query;
    let query = {};
    if (location) query.location = location;
    if (type) query.type = type;

    const slots = await ParkingSlot.find(query).populate('zone', 'name');
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Add a slot
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { slotNumber, location, type, zone } = req.body;
    
    if (!slotNumber || !location || !type || !zone) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const existingSlot = await ParkingSlot.findOne({ slotNumber });
    if (existingSlot) {
      return res.status(400).json({ message: 'Slot number already exists' });
    }

    const newSlot = new ParkingSlot({ slotNumber, location, type, zone });
    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update parking slot details
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { slotNumber, location, type, zone } = req.body;
    if (!slotNumber || !location || !type || !zone) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const slot = await ParkingSlot.findByIdAndUpdate(
      req.params.id,
      { slotNumber, location, type, zone },
      { new: true }
    );
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update slot status (block/unblock)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (status !== 'available' && status !== 'blocked') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const slot = await ParkingSlot.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete a slot
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await ParkingSlot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
