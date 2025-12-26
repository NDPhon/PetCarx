const express = require('express');
const router = express.Router();
const Vaccine = require('../models/Vaccine');

// GET all vaccines
router.get('/', async (req, res) => {
  try {
    const vaccines = await Vaccine.find().sort({ createdAt: -1 });
    res.json(vaccines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new vaccine
router.post('/', async (req, res) => {
  const vaccine = new Vaccine({
    name: req.body.name,
    type: req.body.type,
    price: req.body.price,
    stock: req.body.stock,
    description: req.body.description,
    dosage: req.body.dosage,
    schedule: req.body.schedule
  });

  try {
    const newVaccine = await vaccine.save();
    res.status(201).json(newVaccine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET vaccine by ID
router.get('/:id', async (req, res) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);
    if (!vaccine) {
      return res.status(404).json({ message: 'Vaccine not found' });
    }
    res.json(vaccine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update vaccine
router.put('/:id', async (req, res) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);
    if (!vaccine) {
      return res.status(404).json({ message: 'Vaccine not found' });
    }

    if (req.body.name) vaccine.name = req.body.name;
    if (req.body.type) vaccine.type = req.body.type;
    if (req.body.price) vaccine.price = req.body.price;
    if (req.body.stock) vaccine.stock = req.body.stock;
    if (req.body.description) vaccine.description = req.body.description;
    if (req.body.dosage) vaccine.dosage = req.body.dosage;
    if (req.body.schedule) vaccine.schedule = req.body.schedule;

    const updatedVaccine = await vaccine.save();
    res.json(updatedVaccine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE vaccine
router.delete('/:id', async (req, res) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);
    if (!vaccine) {
      return res.status(404).json({ message: 'Vaccine not found' });
    }
    await vaccine.remove();
    res.json({ message: 'Vaccine deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;