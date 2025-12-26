const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// GET all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new sale
router.post('/', async (req, res) => {
  try {
    // Check if product exists and has enough stock
    const product = await Product.findOne({ name: req.body.productName });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < req.body.quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Create sale
    const sale = new Sale({
      customerName: req.body.customerName,
      phone: req.body.phone,
      productName: req.body.productName,
      quantity: req.body.quantity,
      unitPrice: req.body.unitPrice,
      total: req.body.total
    });

    // Update product stock
    product.stock -= req.body.quantity;
    await product.save();

    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET sale by ID
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE sale
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Restore product stock
    const product = await Product.findOne({ name: sale.productName });
    if (product) {
      product.stock += sale.quantity;
      await product.save();
    }

    await sale.remove();
    res.json({ message: 'Sale deleted and stock restored' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;