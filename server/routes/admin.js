const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

// Get all bookings with user details
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    console.log('Admin fetching bookings...');
    const bookings = await Booking.find()
      .populate('customer', 'name email phone')
      .populate({
        path: 'provider',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('service')
      .sort({ createdAt: -1 });
    console.log('Found bookings:', bookings.length);
    res.json(bookings);
  } catch (error) {
    console.error('Admin bookings error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.put('/bookings/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer', 'name email phone');
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all providers
router.get('/providers', adminAuth, async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate('userId', 'name email phone')
      .populate('services');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/reject provider
router.put('/providers/:id/status', adminAuth, async (req, res) => {
  try {
    const { isApproved } = req.body;
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('userId', 'name email phone');
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    console.log('Admin fetching stats...');
    const totalBookings = await Booking.countDocuments();
    const totalProviders = await Provider.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    
    const stats = {
      totalBookings,
      totalProviders,
      totalUsers,
      pendingBookings
    };
    console.log('Stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;