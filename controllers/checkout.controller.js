const mongoose = require("mongoose");
const Checkout = require("../model/checkout.model");
const asyncWrapper = require("../middleware/asyncwrapper");
const {
  VALID_STATUSES,
  normalizeOrderStatus,
  deductStockForOrder,
  restoreStockForOrder,
  serializeOrder,
} = require("../services/orderStock.service");

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
  res.json(orders.map(serializeOrder));
});

// Get order by ID (admin)
const getCheckoutById = asyncWrapper(async (req, res) => {
  const order = await Checkout.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(serializeOrder(order));
});

// Update order status (admin)
const updateCheckoutStatus = asyncWrapper(async (req, res) => {
  const { status } = req.body;
  const newStatus = normalizeOrderStatus(status);

  if (!VALID_STATUSES.includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const applyStatusChange = async (session) => {
    const order = session
      ? await Checkout.findById(req.params.id).session(session)
      : await Checkout.findById(req.params.id);
    if (!order) {
      const error = new Error("ORDER_NOT_FOUND");
      throw error;
    }

    const oldStatus = normalizeOrderStatus(order.status);
    if (oldStatus === newStatus) {
      return {
        message: "Order status unchanged",
        stockMessage: null,
        order,
      };
    }

    let stockMessage = null;

    if (newStatus === "sold" && !order.stockAdjusted) {
      await deductStockForOrder(order.items, session);
      order.stockAdjusted = true;
      stockMessage = "Product stock reduced for this order.";
    } else if (oldStatus === "sold" && newStatus !== "sold" && order.stockAdjusted) {
      await restoreStockForOrder(order.items, session);
      order.stockAdjusted = false;
      stockMessage = "Product stock restored for this order.";
    } else if (newStatus === "refunded" && order.stockAdjusted) {
      await restoreStockForOrder(order.items, session);
      order.stockAdjusted = false;
      stockMessage = "Product stock restored for this order.";
    }

    order.status = newStatus;
    await order.save(session ? { session } : undefined);

    return {
      message: "Order status updated",
      stockMessage,
      order,
    };
  };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await applyStatusChange(session);
    await session.commitTransaction();
    return res.json({
      message: result.message,
      stockMessage: result.stockMessage,
      order: serializeOrder(result.order),
    });
  } catch (error) {
    await session.abortTransaction().catch(() => {});
    const transactionUnsupported =
      String(error.message || "").includes("replica set") ||
      String(error.message || "").includes("Transaction");

    if (!transactionUnsupported && error.message !== "ORDER_NOT_FOUND") {
      session.endSession();
      return res.status(400).json({
        message: error.message || "Failed to update order status",
      });
    }

    if (error.message === "ORDER_NOT_FOUND") {
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }
  } finally {
    session.endSession();
  }

  try {
    const result = await applyStatusChange(null);
    return res.json({
      message: result.message,
      stockMessage: result.stockMessage,
      order: serializeOrder(result.order),
    });
  } catch (error) {
    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(400).json({
      message: error.message || "Failed to update order status",
    });
  }
});

module.exports = {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  updateCheckoutStatus,
};
