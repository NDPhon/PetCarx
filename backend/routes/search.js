const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const Customer = require('../models/Customer');
const Vaccine = require('../models/Vaccine');

// Search pets
router.get('/pets', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const pets = await Pet.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } },
        { ownerName: { $regex: q, $options: 'i' } },
        { ownerPhone: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search customers
router.get('/customers', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const customers = await Customer.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search vaccines
router.get('/vaccines', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const vaccines = await Vaccine.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    res.json(vaccines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// General search endpoint
router.get('/', async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) {
      return res.json({ pets: [], customers: [], vaccines: [] });
    }

    let results = { pets: [], customers: [], vaccines: [] };

    if (!type || type === 'pets') {
      results.pets = await Pet.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { type: { $regex: q, $options: 'i' } },
          { ownerName: { $regex: q, $options: 'i' } }
        ]
      }).limit(10);
    }

    if (!type || type === 'customers') {
      results.customers = await Customer.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } }
        ]
      }).limit(10);
    }

    if (!type || type === 'vaccines') {
      results.vaccines = await Vaccine.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { type: { $regex: q, $options: 'i' } }
        ]
      }).limit(10);
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;