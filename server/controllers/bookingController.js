const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Service = require('../models/Service');


exports.createBooking = async (req, res) => {
  try {
    const { providerId, serviceId, scheduledDate, address, notes } = req.body;
    
    // Get service details for pricing
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = new Booking({
      customer: req.user.userId,
      provider: providerId,
      service: serviceId,
      scheduledDate,
      address,
      notes,
      price: service.basePrice
    });
    
    await booking.save();
    await booking.populate([
      { path: 'service' },
      { path: 'provider', populate: { path: 'userId', select: 'name phone email' } },
      { path: 'customer', select: 'name phone email' }
    ]);
    


    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.userId })
      .populate('service')
      .populate({
        path: 'provider',
        populate: { path: 'userId', select: 'name phone email' }
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProviderBookings = async (req, res) => {
  try {
    // Find provider by userId
    const provider = await Provider.findOne({ userId: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const bookings = await Booking.find({ provider: provider._id })
      .populate('service')
      .populate('customer', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to update this booking
    const isCustomer = booking.customer.toString() === req.user.userId;
    const provider = await Provider.findOne({ userId: req.user.userId });
    const isProvider = provider && booking.provider.toString() === provider._id.toString();
    
    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();
    
    await booking.populate([
      { path: 'service' },
      { path: 'provider', populate: { path: 'userId', select: 'name phone email' } },
      { path: 'customer', select: 'name phone email' }
    ]);
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('service')
      .populate('customer', 'name email phone')
      .populate({
        path: 'provider',
        populate: { path: 'userId', select: 'name phone email' }
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};