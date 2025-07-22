const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find(); // Fetch all from MongoDB
    res.json(customers); // Return as JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle errors
  }
});

// POST add a customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body); // Create from request body
    await customer.save(); // Save to MongoDB
    res.status(201).json(customer); // Return created customer
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a customer by ID
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    Object.assign(customer, req.body); // Update fields
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.deleteOne();
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;