const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const validate = require("../middleware/validate");
const verfiyToken = require("../middleware/verfiytoken");
const {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../middleware/user.validation");

// Sign Up
router.post("/signup", signupValidation, validate, userController.signup);

// Login
router.post("/login", loginValidation, validate, userController.login);

// Forgot Password
router.post("/forgot-password", forgotPasswordValidation, validate, userController.forgotPassword);

// Reset Password
router.post("/reset-password", resetPasswordValidation, validate, userController.resetPassword);

// Get All Users (protected)
router.get("/", verfiyToken, userController.getAllUsers);

// Get User By ID (protected)
router.get("/:id", verfiyToken, userController.getUserById);

// Delete User By ID (protected)
router.delete("/:id", verfiyToken, userController.deleteUser);

module.exports = router;