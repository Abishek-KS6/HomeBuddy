const Provider = require('../models/Provider');
const User = require('../models/User');

exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ availability: true })
      .populate('userId', 'name email phone')
      .populate('services');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProvidersByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const providers = await Provider.find({ 
      services: { $in: [serviceId] }, 
      availability: true 
    })
      .populate('userId', 'name email phone')
      .populate('services');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('services');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createProvider = async (req, res) => {
  try {
    const { services, experience, bio } = req.body;
    
    // Check if provider profile already exists
    const existingProvider = await Provider.findOne({ userId: req.user.userId });
    if (existingProvider) {
      return res.status(400).json({ message: 'Provider profile already exists' });
    }

    const provider = new Provider({
      userId: req.user.userId,
      services,
      experience,
      bio,
      rating: 0,
      totalReviews: 0
    });

    await provider.save();
    await provider.populate(['userId', 'services']);
    
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findOneAndUpdate(
      { userId: req.user.userId },
      req.body,
      { new: true }
    ).populate(['userId', 'services']);
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.userId })
      .populate('userId', 'name email phone')
      .populate('services');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};