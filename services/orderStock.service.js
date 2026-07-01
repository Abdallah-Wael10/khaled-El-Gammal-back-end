const Product = require("../model/product.model");

const VALID_STATUSES = ["pending", "in_progress", "sold", "refunded"];

function normalizeOrderStatus(status) {
  if (status === "active") return "in_progress";
  return status;
}

function aggregateItemsByProduct(items) {
  const map = new Map();
  for (const item of items || []) {
    const id = String(item.productId);
    const current = map.get(id) || {
      productId: item.productId,
      quantity: 0,
      title: item.title,
    };
    current.quantity += Number(item.quantity) || 1;
    map.set(id, current);
  }
  return Array.from(map.values());
}

async function deductStockForOrder(items, session) {
  const aggregated = aggregateItemsByProduct(items);
  for (const { productId, quantity, title } of aggregated) {
    const query = Product.findById(productId);
    if (session) query.session(session);
    const product = await query;
    if (!product) {
      throw new Error(`Product not found: ${title || productId}`);
    }
    if (product.stock < quantity) {
      throw new Error(`Not enough stock for ${product.title || title}`);
    }
    product.stock -= quantity;
    if (product.stock <= 0) {
      product.stock = 0;
      product.inStock = false;
    }
    await product.save(session ? { session } : undefined);
  }
}

async function restoreStockForOrder(items, session) {
  const aggregated = aggregateItemsByProduct(items);
  for (const { productId, quantity } of aggregated) {
    const query = Product.findById(productId);
    if (session) query.session(session);
    const product = await query;
    if (!product) continue;
    product.stock += quantity;
    if (product.stock > 0) {
      product.inStock = true;
    }
    await product.save(session ? { session } : undefined);
  }
}

function serializeOrder(order) {
  const plain = order.toObject ? order.toObject() : { ...order };
  return {
    ...plain,
    status: normalizeOrderStatus(plain.status),
  };
}

module.exports = {
  VALID_STATUSES,
  normalizeOrderStatus,
  deductStockForOrder,
  restoreStockForOrder,
  serializeOrder,
};
