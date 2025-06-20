const Checkout = require("../model/checkout.model");
const asyncWrapper = require("../middleware/asyncwrapper");

// Create new order
const createCheckout = asyncWrapper(async (req, res) => {
  const { userInfo, items, paymentMethod, total } = req.body;
  const order = new Checkout({
    userInfo,
    items,
    paymentMethod: paymentMethod || "cash-on-delivery",
    total
  });
  await order.save();
  res.status(201).json({ message: "Order placed successfully", orderId: order._id });
});

// Get all orders (admin)
const getAllCheckouts = asyncWrapper(async (req, res) => {
  const orders = await Checkout.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Get order by ID (admin)
const getCheckoutById = asyncWrapper(async (req, res) => {
  const order = await Checkout.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// Update order status (admin)
const updateCheckoutStatus = asyncWrapper(async (req, res) => {
  const { status } = req.body;
  const order = await Checkout.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (!["pending", "active"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  order.status = status;
  await order.save();
  res.json({ message: "Order status updated", order });
});

module.exports = {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  updateCheckoutStatus,
};