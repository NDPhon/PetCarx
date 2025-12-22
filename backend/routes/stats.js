const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Invoice = require('../models/Invoice');
const Appointment = require('../models/Appointment');

// GET revenue statistics
router.get('/revenue', async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Total revenue from sales
    const sales = await Sale.find();
    const totalSalesRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

    // Total revenue from invoices
    const invoices = await Invoice.find();
    const totalInvoiceRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);

    const totalRevenue = totalSalesRevenue + totalInvoiceRevenue;

    // Monthly revenue (current month)
    const monthlySales = await Sale.find({
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      }
    });
    const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.total, 0);

    // Daily revenue (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailySales = await Sale.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });
    const dailyRevenue = dailySales.reduce((sum, sale) => sum + sale.total, 0);

    res.json({
      totalRevenue,
      monthlyRevenue,
      dailyRevenue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET top services/products
router.get('/top-services', async (req, res) => {
  try {
    // Top services from appointments
    const appointments = await Appointment.find({ status: 'completed' });
    const serviceCount = {};

    appointments.forEach(apt => {
      serviceCount[apt.service] = (serviceCount[apt.service] || 0) + 1;
    });

    const topServices = Object.entries(serviceCount)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top products from sales
    const sales = await Sale.find();
    const productRevenue = {};

    sales.forEach(sale => {
      productRevenue[sale.productName] = (productRevenue[sale.productName] || 0) + sale.total;
    });

    const topProducts = Object.entries(productRevenue)
      .map(([product, revenue]) => ({ product, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      topServices,
      topProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET monthly revenue data for charts
router.get('/monthly-data', async (req, res) => {
  try {
    const monthlyData = [];

    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();

      const sales = await Sale.find({
        createdAt: {
          $gte: new Date(year, month, 1),
          $lt: new Date(year, month + 1, 1)
        }
      });

      const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);

      monthlyData.push({
        month: `Tháng ${month + 1}`,
        revenue
      });
    }

    res.json(monthlyData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;