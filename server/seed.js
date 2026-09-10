require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Zone = require('./models/Zone');
const ParkingSlot = require('./models/ParkingSlot');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Zone.deleteMany({});
    await ParkingSlot.deleteMany({});

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@parking.com',
      password: adminPassword,
      role: 'admin'
    });

    const studentUser = await User.create({
      name: 'John Doe',
      email: 'user@parking.com',
      password: userPassword,
      role: 'user'
    });

    console.log('Created Users:');
    console.log('Admin: admin@parking.com / admin123');
    console.log('User:  user@parking.com / user123');

    // 2. Create Zones
    const zoneA = await Zone.create({
      name: 'Zone A',
      location: 'Ground Floor, North Wing'
    });

    const zoneB = await Zone.create({
      name: 'Zone B',
      location: 'Basement 1, South Wing'
    });

    console.log('Created Zones: Zone A, Zone B');

    // 3. Create Slots
    await ParkingSlot.create([
      { slotNumber: 'A-101', location: 'Ground Floor', type: 'Car', zone: zoneA._id, status: 'available' },
      { slotNumber: 'A-102', location: 'Ground Floor', type: 'Bike', zone: zoneA._id, status: 'available' },
      { slotNumber: 'A-103', location: 'Ground Floor', type: 'EV', zone: zoneA._id, status: 'available' },
      { slotNumber: 'B-201', location: 'Basement 1', type: 'Car', zone: zoneB._id, status: 'available' },
      { slotNumber: 'B-202', location: 'Basement 1', type: 'Car', zone: zoneB._id, status: 'available' },
      { slotNumber: 'B-203', location: 'Basement 1', type: 'Bike', zone: zoneB._id, status: 'blocked' }
    ]);

    console.log('Created 6 Sample Parking Slots');
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
