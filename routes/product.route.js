const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const verfiyToken = require("../middleware/verfiytoken");
const upload = require("../middleware/upload");
const {
  createProductValidation,
  updateProductValidation,
  idValidation
} = require("../middleware/product.validation");
const validate = require("../middleware/validate");
const isAdmin = require("../middleware/isAdmin");

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

module.exports = router;