const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBooking, getUserBookings, getProviderBookings, updateBookingStatus, 
    getAllBookings } = require('../controllers/bookingController');
router.post('/', auth, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.get('/provider-bookings', auth, getProviderBookings);
router.get('/all', auth, getAllBookings);
router.patch('/:id/status', auth, updateBookingStatus);
module.exports = router;