const Review = require('../models/Review');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

exports.createReview = async (req, res) => {
  try {
    const { providerId, bookingId, rating, comment } = req.body;
    
    // Check if booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user.userId,
      status: 'completed'
    });
    
    if (!booking) {
      return res.status(400).json({ message: 'Invalid booking or booking not completed' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = new Review({
      customer: req.user.userId,
      provider: providerId,
      booking: bookingId,
      rating,
      comment
    });

    await review.save();
    await review.populate(['customer', 'provider']);

    // Update provider rating
    await updateProviderRating(providerId);
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    const reviews = await Review.find({ provider: providerId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.user.userId })
      .populate('provider')
      .populate('booking')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to update provider rating
const updateProviderRating = async (providerId) => {
  try {
    const reviews = await Review.find({ provider: providerId });
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    await Provider.findByIdAndUpdate(providerId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      totalReviews
    });
  } catch (error) {
    console.error('Error updating provider rating:', error);
  }
};