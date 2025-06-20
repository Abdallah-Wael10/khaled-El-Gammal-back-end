const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  userInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    governorate: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String },
    notes: { type: String }
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      mainImage: { type: String, required: true },
      quantity: { type: Number, required: true },
      size: { type: String }
    }
  ],
  paymentMethod: { type: String, default: "cash-on-delivery" },
  total: { type: Number, required: true },
  status: { type: String, enum: ["pending", "active"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Checkout", checkoutSchema);
