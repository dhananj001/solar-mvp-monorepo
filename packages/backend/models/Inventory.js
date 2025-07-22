const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  stockLevel: {
    type: Number,
    min: [0, 'Stock level cannot be negative'],
    required: [true, 'Stock level is required'],
  },
  threshold: {
    type: Number,
    min: [0, 'Threshold cannot be negative'],
    default: 10, // Alert if stock < 10
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inventory', inventorySchema);