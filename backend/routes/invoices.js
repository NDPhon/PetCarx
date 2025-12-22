const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// GET all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new invoice
router.post('/', async (req, res) => {
  const invoice = new Invoice({
    invoiceNumber: req.body.invoiceNumber,
    customerName: req.body.customerName,
    phone: req.body.phone,
    date: req.body.date,
    items: req.body.items,
    subtotal: req.body.subtotal,
    tax: req.body.tax,
    total: req.body.total,
    notes: req.body.notes
  });

  try {
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (req.body.customerName) invoice.customerName = req.body.customerName;
    if (req.body.phone) invoice.phone = req.body.phone;
    if (req.body.date) invoice.date = req.body.date;
    if (req.body.items) invoice.items = req.body.items;
    if (req.body.subtotal) invoice.subtotal = req.body.subtotal;
    if (req.body.tax) invoice.tax = req.body.tax;
    if (req.body.total) invoice.total = req.body.total;
    if (req.body.notes) invoice.notes = req.body.notes;
    if (req.body.status) invoice.status = req.body.status;

    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    await invoice.remove();
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;