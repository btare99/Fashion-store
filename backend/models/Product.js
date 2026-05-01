const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: null },
  category: { type: String, required: true, enum: ['Këpucë', 'Rroba Burra', 'Rroba Gra', 'Aksesorë', 'Çanta', 'Sporte', 'Fëmijë'] },
  subcategory: { type: String, default: '' },
  brand: { type: String, default: '' },
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ 
    name: String,
    hex: String
  }],
  stock: { type: Number, default: 0 },
  isNewUser: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
