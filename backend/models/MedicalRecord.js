const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  petName: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  medications: {
    type: String
  },
  notes: {
    type: String
  },
  followUpDate: {
    type: Date
  },
  veterinarian: {
    type: String,
    default: 'Dr. PetCarx'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);