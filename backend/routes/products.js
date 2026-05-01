const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all products (with filter/search/sort)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, isSale, isFeatured, isNewUser } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ];
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (isSale === 'true') filter.isSale = true;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isNewUser === 'true') filter.isNewUser = true;

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'name') sortObj = { name: 1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    const products = await Product.find(filter).sort(sortObj);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produkti nuk u gjet' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create product (admin)
router.post('/', upload.array('images', 6), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : data.images || [];
    const product = new Product({ ...data, images });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update product (admin)
router.put('/:id', upload.array('images', 6), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Produkti nuk u gjet' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE product (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produkti u fshi me sukses' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
