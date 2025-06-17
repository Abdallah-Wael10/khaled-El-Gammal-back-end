const { body, param } = require('express-validator');

exports.createGalleryValidation = [
  body('title').isString().trim().notEmpty().withMessage('Title is required').escape(),
];

exports.updateGalleryValidation = [
  body('title').optional().isString().trim().escape(),
];

exports.idValidation = [
  param('id').isMongoId().withMessage('Invalid gallery ID')
];