const { body } = require('express-validator');

exports.checkoutValidation = [
  body('userInfo.name').isString().notEmpty().withMessage('Name is required'),
  body('userInfo.phone').isString().notEmpty().withMessage('Phone is required'),
  body('userInfo.email').isEmail().withMessage('Valid email is required'),
  body('userInfo.country').isString().notEmpty().withMessage('Country is required'),
  body('userInfo.governorate').isString().notEmpty().withMessage('Governorate is required'),
  body('userInfo.address').isString().notEmpty().withMessage('Address is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isString().notEmpty().withMessage('Product ID is required'),
  body('items.*.title').isString().notEmpty(),
  body('items.*.price').isNumeric(),
  body('items.*.mainImage').isString().notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('total').isNumeric().withMessage('Total is required'),
];

exports.statusValidation = [
  body('status').isIn(['pending', 'active']).withMessage('Status must be pending or active'),
];
