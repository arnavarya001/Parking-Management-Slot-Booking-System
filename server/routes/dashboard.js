const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');
const Booking = require('../models/Booking');
const Zone = require('../models/Zone');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalSlots = await ParkingSlot.countDocuments();
    const blockedSlots = await ParkingSlot.countDocuments({ status: 'blocked' });
    const availableSlotsTotal = totalSlots - blockedSlots;

    // Today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysBookings = await Booking.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Currently active bookings to find occupied slots
    const now = new Date();
    const activeBookings = await Booking.find({
      status: 'active',
      startTime: { $lte: now },
      endTime: { $gte: now }
    });
    
    const occupiedSlotsCount = activeBookings.length;
    const currentlyAvailable = availableSlotsTotal - occupiedSlotsCount;

    // Zone-wise occupancy
    const zones = await Zone.find();
    const zoneStats = [];

    for (let zone of zones) {
      const zoneSlots = await ParkingSlot.find({ zone: zone._id });
      const zoneTotal = zoneSlots.length;
      
      const zoneSlotIds = zoneSlots.map(s => s._id);
      
      const zoneOccupied = activeBookings.filter(b => 
        zoneSlotIds.some(id => id.toString() === b.slot.toString())
      ).length;

      zoneStats.push({
        zoneName: zone.name,
        total: zoneTotal,
        occupied: zoneOccupied,
        available: zoneTotal - zoneOccupied
      });
    }

    res.json({
      availableSlots: currentlyAvailable,
      occupiedSlots: occupiedSlotsCount,
      todaysBookings,
      zoneStats
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
