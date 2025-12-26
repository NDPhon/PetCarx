const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Bắt buộc', 'Khuyến nghị', 'Phòng ngừa']
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String
  },
  dosage: {
    type: String
  },
  schedule: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vaccine', vaccineSchema);