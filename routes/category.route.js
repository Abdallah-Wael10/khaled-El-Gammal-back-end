const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const verfiyToken = require("../middleware/verfiytoken");
const isAdmin = require("../middleware/isAdmin");
const validate = require("../middleware/validate");
const {
  createCategoryValidation,
  updateCategoryValidation,
  idValidation,
} = require("../middleware/category.validation");

router.get("/", categoryController.getAllCategories);
router.get("/:id", idValidation, validate, categoryController.getCategoryById);

router.post(
  "/",
  verfiyToken,
  isAdmin,
  createCategoryValidation,
  validate,
  categoryController.createCategory
);

router.put(
  "/:id",
  verfiyToken,
  isAdmin,
  updateCategoryValidation,
  idValidation,
  validate,
  categoryController.updateCategory
);

router.delete(
  "/:id",
  verfiyToken,
  isAdmin,
  idValidation,
  validate,
  categoryController.deleteCategory
);

module.exports = router;
