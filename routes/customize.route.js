const express = require("express");
const router = express.Router();
const customizeController = require("../controllers/customize.controller");
const verfiyToken = require("../middleware/verfiytoken");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const { createCustomizeValidation, updateCustomizeValidation, idValidation } = require("../middleware/customize.validation");
const isAdmin = require("../middleware/isAdmin");

// Create Customize (public, with images)
router.post(
  "/",
  upload.array("image", 5), // max 5 images
  createCustomizeValidation,
  validate,
  customizeController.createCustomize
);

// Get All Customizes (protected)
router.get("/", verfiyToken, isAdmin, customizeController.getAllCustomizes);

// Get Customize By ID (protected)
router.get("/:id", verfiyToken, isAdmin, idValidation, validate, customizeController.getCustomizeById);

// Update Customize (protected)
router.put(
  "/:id",
  verfiyToken,
  isAdmin,
  upload.array("image", 5),
  updateCustomizeValidation,
  idValidation,
  validate,
  customizeController.updateCustomize
);

// Delete Customize (protected)
router.delete("/:id", verfiyToken, isAdmin, idValidation, validate, customizeController.deleteCustomize);

module.exports = router;