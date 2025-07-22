const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed'],
    default: 'pending',
  },
  milestones: {
    type: [String], // Array of strings, e.g., ['Site survey', 'Installation']
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);