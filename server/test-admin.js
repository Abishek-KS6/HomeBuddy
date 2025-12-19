const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');
const Provider = require('./models/Provider');
require('dotenv').config();

const testAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const admin = await User.findOne({ role: 'admin' });
    console.log('Admin user:', admin ? 'Found' : 'Not found');

    // Check bookings count
    const bookingsCount = await Booking.countDocuments();
    console.log('Total bookings:', bookingsCount);

    // Check providers count
    const providersCount = await Provider.countDocuments();
    console.log('Total providers:', providersCount);

    // Check users count
    const usersCount = await User.countDocuments({ role: 'customer' });
    console.log('Total users:', usersCount);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testAdmin();