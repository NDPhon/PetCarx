const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// GET all pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new pet
router.post('/', async (req, res) => {
  const pet = new Pet({
    name: req.body.name,
    type: req.body.type,
    breed: req.body.breed,
    age: req.body.age,
    weight: req.body.weight,
    ownerName: req.body.ownerName,
    ownerPhone: req.body.ownerPhone,
    ownerEmail: req.body.ownerEmail
  });

  try {
    const newPet = await pet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update pet
router.put('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (req.body.name) pet.name = req.body.name;
    if (req.body.type) pet.type = req.body.type;
    if (req.body.breed) pet.breed = req.body.breed;
    if (req.body.age) pet.age = req.body.age;
    if (req.body.weight) pet.weight = req.body.weight;
    if (req.body.ownerName) pet.ownerName = req.body.ownerName;
    if (req.body.ownerPhone) pet.ownerPhone = req.body.ownerPhone;
    if (req.body.ownerEmail) pet.ownerEmail = req.body.ownerEmail;

    const updatedPet = await pet.save();
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE pet
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    await pet.remove();
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;