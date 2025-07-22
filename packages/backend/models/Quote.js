const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId, // References Customer model (Mongoose 8.16.x ObjectId handling)
    ref: 'Customer', // Populates with customer data on queries
    required: [true, 'Customer ID is required'],
  },
  systemSize: {
    type: Number,
    min: [0, 'System size cannot be negative'],
    required: [true, 'System size is required'],
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative'],
    required: [true, 'Cost is required'],
  },
  subsidyApplied: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Quote', quoteSchema);