const express = require('express');
const router = express.Router();
const Subsidy = require('../models/Subsidy');

// GET all subsidies
router.get('/', async (req, res) => {
  try {
    const subsidies = await Subsidy.find();
    res.json(subsidies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add a subsidy
router.post('/', async (req, res) => {
  try {
    const subsidy = new Subsidy(req.body);
    await subsidy.save();
    res.status(201).json(subsidy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET eligibility for a customer (example: custom query)
router.get('/eligibility/:customerId', async (req, res) => {
  try {
    // Placeholder logic; in real, query based on customer data
    const subsidies = await Subsidy.find(); // Return all for now
    res.json(subsidies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;