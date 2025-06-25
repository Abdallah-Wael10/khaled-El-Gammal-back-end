const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shipping.controller");
const validate = require("../middleware/validate");
const verfiyToken = require("../middleware/verfiytoken");
const isAdmin = require("../middleware/isAdmin");
const { shippingValidation } = require("../middleware/shipping.validation");

// Public: Get shipping cost
router.get("/", shippingController.getShipping);

// Admin: Create shipping cost (only if not exists)
router.post(
  "/",
  verfiyToken,
  isAdmin,
  shippingValidation,
  validate,
  shippingController.createShipping
);

// Admin: Update shipping cost
router.put(
  "/",
  verfiyToken,
  isAdmin,
  shippingValidation,
  validate,
  shippingController.updateShipping
);

// Admin: Delete shipping cost
router.delete(
  "/",
  verfiyToken,
  isAdmin,
  shippingController.deleteShipping
);

module.exports = router;