const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { sendOrderNotification } = require('../utils/email');

// POST create order + send emails
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Send email notifications
    try {
      await sendOrderNotification(order);
    } catch (emailErr) {
      console.error('Email error (non-fatal):', emailErr.message);
    }

    res.status(201).json({ 
      message: 'Porosia u krye me sukses!', 
      orderNumber: order.orderNumber,
      order 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Porosia nuk u gjet' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update order status (admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Porosia nuk u gjet' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE order (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Porosia u fshi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET stats (admin dashboard)
router.get('/admin/stats', async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'Në pritje' });
    const confirmed = await Order.countDocuments({ status: 'Konfirmuar' });
    const delivered = await Order.countDocuments({ status: 'Dorëzuar' });
    const revenue = await Order.aggregate([
      { $match: { status: { $ne: 'Anuluar' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    res.json({ total, pending, confirmed, delivered, revenue: revenue[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
