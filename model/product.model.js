const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    required: true
  },
  inStock: {
    type: Boolean,
    required: true,
    default: true
  },
  category: {
    type: String,
    required: true
  },
  mainImage: {
    type: String,
    required: true
  },
   images : {
    type: [String],
    required: true
  },
    stock: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);



