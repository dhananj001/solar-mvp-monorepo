const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Quote = require('../models/Quote');
const Subsidy = require('../models/Subsidy');
const Project = require('../models/Project');
const Inventory = require('../models/Inventory');

// GET dashboard insights
router.get('/insights', async (req, res) => {
  try {
    // Aggregate customer metrics
    const customerStats = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          avgEnergyNeeds: { $avg: '$energyNeeds' },
          residentialCount: {
            $sum: { $cond: [{ $eq: ['$type', 'residential'] }, 1, 0] },
          },
          commercialCount: {
            $sum: { $cond: [{ $eq: ['$type', 'commercial'] }, 1, 0] },
          },
        },
      },
    ]);

    // Aggregate project metrics
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          activeProjects: {
            $sum: { $cond: [{ $in: ['$status', ['pending', 'ongoing']] }, 1, 0] },
          },
        },
      },
    ]);

    // Aggregate inventory metrics
    const inventoryStats = await Inventory.aggregate([
      {
        $match: { stockLevel: { $lt: '$threshold' } }, // Low stock items
      },
      {
        $group: {
          _id: null,
          lowStockCount: { $sum: 1 },
          totalStockValue: { $sum: { $multiply: ['$stockLevel', 1000] } }, // Example: assume $1000 per item
        },
      },
    ]);

    // Aggregate subsidy metrics
    const subsidyStats = await Quote.aggregate([
      {
        $group: {
          _id: null,
          totalSubsidiesApplied: { $sum: '$subsidyApplied' },
        },
      },
    ]);

    // Combine results
    const insights = {
      totalCustomers: customerStats[0]?.totalCustomers || 0,
      avgEnergyNeeds: customerStats[0]?.avgEnergyNeeds?.toFixed(2) || 0,
      residentialCount: customerStats[0]?.residentialCount || 0,
      commercialCount: customerStats[0]?.commercialCount || 0,
      totalProjects: projectStats[0]?.totalProjects || 0,
      activeProjects: projectStats[0]?.activeProjects || 0,
      lowStockCount: inventoryStats[0]?.lowStockCount || 0,
      totalStockValue: inventoryStats[0]?.totalStockValue || 0,
      totalSubsidiesApplied: subsidyStats[0]?.totalSubsidiesApplied || 0,
    };

    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handled by global error middleware
  }
});

module.exports = router;