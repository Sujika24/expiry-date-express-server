const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    upc: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1'],
      default: 1,
    },
    unit: {
      type: String,
      trim: true,
      default: 'pcs',
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: true,
    },
    categoryOrLocation: {
      type: String,
      trim: true,
      default: 'Pantry',
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index: Primary Dashboard query (user inventory sorted by expiry date)
productSchema.index({ user: 1, expiryDate: 1 });

// Compound Index: UPC barcode lookup per user
productSchema.index({ user: 1, upc: 1 });

// Text Index: Search by title per user
productSchema.index({ user: 1, title: 'text' });

module.exports = mongoose.model('Product', productSchema);
