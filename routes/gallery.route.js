const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/gallery.controller");
const verfiyToken = require("../middleware/verfiytoken");
const upload = require("../middleware/upload");
const {
  createGalleryValidation,
  updateGalleryValidation,
  idValidation
} = require("../middleware/gallery.validation");
const validate = require("../middleware/validate");
const isAdmin = require("../middleware/isAdmin");

// Create Gallery Item (protected)
router.post(
  "/",
  verfiyToken,
  isAdmin,
  upload.single("image"),
  createGalleryValidation,
  validate,
  galleryController.createGallery
);

// Get All Gallery Items
router.get("/", galleryController.getAllGallery);

// Get Gallery Item By ID
router.get("/:id", idValidation, validate, galleryController.getGalleryById);

// Update Gallery Item (protected)
router.put(
  "/:id",
  verfiyToken,
  isAdmin,
  upload.single("image"),
  updateGalleryValidation,
  idValidation,
  validate,
  galleryController.updateGallery
);

// Delete Gallery Item (protected)
router.delete("/:id", verfiyToken, isAdmin, idValidation, validate, galleryController.deleteGallery);

module.exports = router;