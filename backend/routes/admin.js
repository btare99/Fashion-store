const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// POST login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: 'Kredencialet janë të gabuara' });
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Kredencialet janë të gabuara' });
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST register first admin (one-time setup)
router.post('/setup', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ error: 'Admin ekziston tashmë' });
    const { username, password, email } = req.body;
    const admin = new Admin({ username, password, email });
    await admin.save();
    res.status(201).json({ message: 'Admin u krijua me sukses' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
