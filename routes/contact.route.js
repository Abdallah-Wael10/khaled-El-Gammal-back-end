const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
const verfiyToken = require("../middleware/verfiytoken");
const {
  createContactValidation,
  updateContactValidation,
  idValidation
} = require("../middleware/contact.validation");
const validate = require("../middleware/validate");
const isAdmin = require("../middleware/isAdmin");

// Create Contact (public)
router.post(
  "/",
  createContactValidation,
  validate,
  contactController.createContact
);

// Get All Contacts (protected)
router.get("/", verfiyToken, isAdmin, contactController.getAllContacts);

// Get Contact By ID (protected)
router.get("/:id", verfiyToken, isAdmin, idValidation, validate, contactController.getContactById);

// Update Contact (protected)
router.put(
  "/:id",
  verfiyToken,
  isAdmin,
  updateContactValidation,
  idValidation,
  validate,
  contactController.updateContact
);

// Delete Contact (protected)
router.delete("/:id", verfiyToken, isAdmin, idValidation, validate, contactController.deleteContact);

module.exports = router;