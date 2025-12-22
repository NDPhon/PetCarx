const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');

// GET all medical records
router.get('/', async (req, res) => {
  try {
    const records = await MedicalRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new medical record
router.post('/', async (req, res) => {
  const record = new MedicalRecord({
    petName: req.body.petName,
    ownerName: req.body.ownerName,
    symptoms: req.body.symptoms,
    diagnosis: req.body.diagnosis,
    treatment: req.body.treatment,
    medications: req.body.medications,
    notes: req.body.notes,
    followUpDate: req.body.followUpDate,
    veterinarian: req.body.veterinarian
  });

  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET medical record by ID
router.get('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update medical record
router.put('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    if (req.body.petName) record.petName = req.body.petName;
    if (req.body.ownerName) record.ownerName = req.body.ownerName;
    if (req.body.symptoms) record.symptoms = req.body.symptoms;
    if (req.body.diagnosis) record.diagnosis = req.body.diagnosis;
    if (req.body.treatment) record.treatment = req.body.treatment;
    if (req.body.medications) record.medications = req.body.medications;
    if (req.body.notes) record.notes = req.body.notes;
    if (req.body.followUpDate) record.followUpDate = req.body.followUpDate;
    if (req.body.veterinarian) record.veterinarian = req.body.veterinarian;

    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE medical record
router.delete('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    await record.remove();
    res.json({ message: 'Medical record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;