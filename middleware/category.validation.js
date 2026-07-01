const { body, param } = require("express-validator");

exports.createCategoryValidation = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .escape(),
];

exports.updateCategoryValidation = [
  body("name")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty")
    .escape(),
];

exports.idValidation = [
  param("id").isMongoId().withMessage("Invalid category ID"),
];
