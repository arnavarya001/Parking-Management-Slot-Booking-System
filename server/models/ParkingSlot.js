const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g., 'Car', 'Bike'
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'blocked'],
    default: 'available',
  },
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
