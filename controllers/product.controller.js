const Product = require("../model/product.model");
const asyncWrapper = require("../middleware/asyncwrapper");
const fs = require("fs");
const path = require("path");

// Create Product
const createProduct = asyncWrapper(async (req, res) => {
  const {
    title,
    description,
    price,
    discountPrice,
    inStock,
    category,
    stock
  } = req.body;

  if (!req.files || !req.files.mainImage || req.files.mainImage.length === 0) {
    return res.status(400).json({ message: "Main image is required" });
  }

  const mainImage = req.files.mainImage[0].filename;
  const images = req.files.images ? req.files.images.map(file => file.filename) : [];

  const product = new Product({
    title,
    description,
    price,
    discountPrice,
    inStock,
    category,
    mainImage,
    images,
    stock
  });

  await product.save();
  res.status(201).json(product);
});

// Get All Products
const getAllProducts = asyncWrapper(async (req, res) => {
  const products = await Product.find({}, { __v: false });
  res.json(products);
});

// Get Product By ID
const getProductById = asyncWrapper(async (req, res) => {
  const product = await Product.findById(req.params.id, { __v: false });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Update Product
const updateProduct = asyncWrapper(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const {
    title,
    description,
    price,
    discountPrice,
    inStock,
    category,
    stock
  } = req.body;

  // Handle mainImage update
  if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
    // Remove old main image
    try {
      fs.unlinkSync(path.join('uploads', product.mainImage));
    } catch (e) {}
    product.mainImage = req.files.mainImage[0].filename;
  }

  // Handle images array update
  if (req.files && req.files.images && req.files.images.length > 0) {
    // Remove old images
    product.images.forEach(img => {
      try {
        fs.unlinkSync(path.join('uploads', img));
      } catch (e) {}
    });
    product.images = req.files.images.map(file => file.filename);
  }

  product.title = title ?? product.title;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.discountPrice = discountPrice ?? product.discountPrice;
  product.inStock = inStock ?? product.inStock;
  product.category = category ?? product.category;
  product.stock = stock ?? product.stock;

  await product.save();
  res.json(product);
});

// Delete Product
const deleteProduct = asyncWrapper(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // Remove images from disk
  try {
    fs.unlinkSync(path.join('uploads', product.mainImage));
    product.images.forEach(img => {
      fs.unlinkSync(path.join('uploads', img));
    });
  } catch (e) {}

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
}