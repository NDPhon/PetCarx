const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Chó', 'Mèo', 'Chim', 'Thỏ', 'Khác']
  },
  breed: {
    type: String
  },
  age: {
    type: Number,
    required: true
  },
  weight: {
    type: Number
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerPhone: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String
  },
  medicalHistory: [{
    date: Date,
    diagnosis: String,
    treatment: String,
    notes: String
  }],
  vaccinations: [{
    vaccineName: String,
    date: Date,
    nextDueDate: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Pet', petSchema);