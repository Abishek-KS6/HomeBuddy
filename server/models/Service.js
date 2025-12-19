const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['plumbing', 'electrical', 'cleaning', 'painting', 'carpentry', 'appliance-repair', 'pest-control', 'other'] },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  pricePerHour: { type: Number, default: 0 },

  image: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Service', serviceSchema);
