const mongoose = require('mongoose');

const subsidySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subsidy name is required'],
    trim: true,
  },
  eligibilityCriteria: {
    type: String, // e.g., 'Residential, energyNeeds > 500'
    required: [true, 'Eligibility criteria is required'],
  },
  amount: {
    type: Number,
    min: [0, 'Amount cannot be negative'],
    required: [true, 'Amount is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subsidy', subsidySchema);