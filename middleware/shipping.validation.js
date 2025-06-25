const { body } = require("express-validator");

exports.shippingValidation = [
  body("shippingCost")
    .isNumeric()
    .withMessage("Shipping cost must be a number")
    .isFloat({ min: 0 })
    .withMessage("Shipping cost must be 0 or greater"),
];