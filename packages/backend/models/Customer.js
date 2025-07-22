const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  energyNeeds: { type: Number, required: false } // kWh/month
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);