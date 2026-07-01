const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const productController = require("../controllers/product.controller");
const Product = require("../model/product.model");
const verfiyToken = require("../middleware/verfiytoken");
const upload = require("../middleware/upload");
const asyncWrapper = require("../middleware/asyncwrapper");
const {
  createProductValidation,
  updateProductValidation,
  idValidation
} = require("../middleware/product.validation");
const validate = require("../middleware/validate");
const isAdmin = require("../middleware/isAdmin");

const MAX_GALLERY_IMAGES = 10;

const removeUploadedFile = (filename) => {
  if (!filename) return;
  try {
    fs.unlinkSync(path.join("uploads", filename));
  } catch {}
};

// Create Product (protected)
router.post(
  "/",
  verfiyToken,
  isAdmin,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  createProductValidation,
  validate,
  productController.createProduct
);

// Get All Products
router.get("/", productController.getAllProducts);

// Get Product By ID
router.get("/:id", idValidation, validate, productController.getProductById);

// Update Product (protected)
router.put(
  "/:id",
  verfiyToken,
  isAdmin,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  updateProductValidation,
  idValidation,
  validate,
  productController.updateProduct
);

// Delete Product (protected)
router.delete("/:id", verfiyToken, isAdmin, idValidation, validate, productController.deleteProduct);

// Add a new image to images array
router.post(
  "/:id/images",
  verfiyToken,
  isAdmin,
  upload.single("image"),
  asyncWrapper(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    if (product.images.length >= MAX_GALLERY_IMAGES) {
      removeUploadedFile(req.file.filename);
      return res.status(400).json({ message: "Maximum 10 gallery images allowed" });
    }
    product.images.push(req.file.filename);
    await product.save();
    res.json(productController.serializeProduct(product));
  })
);

// Replace a specific image in images array
router.put(
  "/:id/images/:imageName",
  verfiyToken,
  isAdmin,
  upload.single("image"),
  asyncWrapper(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const idx = product.images.indexOf(req.params.imageName);
    if (idx === -1) return res.status(404).json({ message: "Image not found" });
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    removeUploadedFile(req.params.imageName);
    product.images[idx] = req.file.filename;
    await product.save();
    res.json(productController.serializeProduct(product));
  })
);

// Delete a specific image from images array
router.delete(
  "/:id/images/:imageName",
  verfiyToken,
  isAdmin,
  asyncWrapper(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const idx = product.images.indexOf(req.params.imageName);
    if (idx === -1) return res.status(404).json({ message: "Image not found" });
    removeUploadedFile(req.params.imageName);
    product.images.splice(idx, 1);
    await product.save();
    res.json(productController.serializeProduct(product));
  })
);

module.exports = router;
