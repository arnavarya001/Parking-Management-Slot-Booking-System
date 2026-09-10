const express = require('express');
const router = express.Router();
const Zone = require('../models/Zone');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all zones (public or auth)
router.get('/', async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new zone (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const newZone = new Zone({ name, location });
    await newZone.save();
    res.status(201).json(newZone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a zone (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const updatedZone = await Zone.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { new: true }
    );
    if (!updatedZone) return res.status(404).json({ message: 'Zone not found' });
    res.json(updatedZone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a zone
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Zone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Zone deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
