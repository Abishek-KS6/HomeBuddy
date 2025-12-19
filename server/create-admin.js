const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = new User({
      name: 'Admin',
      email: 'admin@homebuddy.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: admin@homebuddy.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();