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

// PUT update a subsidy by ID
router.put('/:id', async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id);
    if (!subsidy) return res.status(404).json({ message: 'Subsidy not found' });
    Object.assign(subsidy, req.body);
    await subsidy.save();
    res.json(subsidy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a subsidy by ID
router.delete('/:id', async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id);
    if (!subsidy) return res.status(404).json({ message: 'Subsidy not found' });
    await subsidy.deleteOne();
    res.json({ message: 'Subsidy deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET eligibility for a customer (placeholder for now)
router.get('/eligibility/:customerId', async (req, res) => {
  try {
    const subsidies = await Subsidy.find();
    res.json(subsidies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;