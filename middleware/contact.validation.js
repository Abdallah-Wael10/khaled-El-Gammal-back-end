const { body, param } = require('express-validator');

exports.createContactValidation = [
  body('name').isString().trim().notEmpty().withMessage('Name is required').escape(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').isString().trim().notEmpty().withMessage('Phone is required'),
  body('comment').isString().trim().notEmpty().withMessage('Comment is required').escape(),
  body('status')
    .optional()
    .isIn(['Pending', 'Active'])
    .withMessage('Status must be either Pending or Active'),
];

exports.updateContactValidation = [
  body('name').optional().isString().trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isString().trim(),
  body('comment').optional().isString().trim().escape(),
  body('status')
    .optional()
    .isIn(['Pending', 'Active'])
    .withMessage('Status must be either Pending or Active'),
];

exports.idValidation = [
  param('id').isMongoId().withMessage('Invalid contact ID')
];
