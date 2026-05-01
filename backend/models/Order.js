const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  quantity: Number,
  size: String,
  color: String,
  image: String,
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true },
    phone:     { type: String, required: true },
    address:   { type: String, required: true },
    city:      { type: String, required: true },
    zipCode:   { type: String, default: '' },
    notes:     { type: String, default: '' },
  },
  items: [orderItemSchema],
  subtotal:  { type: Number, required: true },
  shipping:  { type: Number, default: 0 },
  total:     { type: Number, required: true },
  status: {
    type: String,
    enum: ['Në pritje', 'Konfirmuar', 'Dërguar', 'Dorëzuar', 'Anuluar'],
    default: 'Në pritje'
  },
  paymentMethod: { type: String, default: 'Para në dorë' },
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `FS-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
