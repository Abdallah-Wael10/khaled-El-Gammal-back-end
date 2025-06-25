const Shipping = require("../model/shipping.model");

// Get shipping cost (public)
const getShipping = async (req, res) => {
  const shipping = await Shipping.findOne();
  if (!shipping) return res.status(404).json({ message: "Shipping cost not set" });
  res.json(shipping);
};

// Create shipping cost (admin only, only one allowed)
const createShipping = async (req, res) => {
  const { shippingCost } = req.body;
  const exists = await Shipping.findOne();
  if (exists) return res.status(400).json({ message: "Shipping cost already exists. Use update instead." });
  const shipping = await Shipping.create({ shippingCost });
  res.status(201).json(shipping);
};

// Update shipping cost (admin only)
const updateShipping = async (req, res) => {
  const { shippingCost } = req.body;
  const shipping = await Shipping.findOne();
  if (!shipping) return res.status(404).json({ message: "Shipping cost not set" });
  shipping.shippingCost = shippingCost;
  await shipping.save();
  res.json(shipping);
};

// Delete shipping cost (admin only)
const deleteShipping = async (req, res) => {
  const shipping = await Shipping.findOne();
  if (!shipping) return res.status(404).json({ message: "Shipping cost not set" });
  await shipping.deleteOne();
  res.json({ message: "Shipping cost deleted" });
};

module.exports = {
  getShipping,
  createShipping,
  updateShipping,
  deleteShipping,
};