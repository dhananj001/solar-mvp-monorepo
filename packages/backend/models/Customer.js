const mongoose = require('mongoose');

// Define the schema for customers in CRM
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], // Latest validation: custom error message
    trim: true, // Removes whitespace
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
    trim: true,
  },
  energyNeeds: {
    type: Number,
    min: [0, 'Energy needs cannot be negative'], // Latest schematype min validator
    default: 0,
  },
  type: {
    type: String,
    enum: ['residential', 'commercial'], // Restricts to specific values
    default: 'residential',
  },
}, {
  timestamps: true, // Auto-adds createdAt and updatedAt (Mongoose 8.16.x feature)
});

// Export the model
module.exports = mongoose.model('Customer', customerSchema);