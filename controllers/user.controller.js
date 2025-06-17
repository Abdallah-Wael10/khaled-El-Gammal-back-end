const User = require("../model/user.model");
const asyncWrapper = require("../middleware/asyncwrapper");
const bcrypt = require("bcrypt");
const genrateToken = require("../utils/genrateToken");
const nodemailer = require("nodemailer");

// Helper: send email
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

// Sign Up
const signup = asyncWrapper(async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ fullName, email, phone, password: hashed });
  await user.save();
  const token = await genrateToken({ id: user._id, email: user.email, role: "user" });
  res
    .status(201)
    .json({ token, user: { id: user._id, fullName, email, phone } });
});

// Login
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = await genrateToken({ id: user._id, email: user.email, role: "user" });
  res.json({
    token,
    user: { id: user._id, fullName: user.fullName, email, phone: user.phone },
  });
});

// Forgot Password (send code)
const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = code;
  user.resetCodeExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  await sendEmail(email, "Your Password Reset Code", `Your code is: ${code}`);
  res.json({ message: "Reset code sent to your email" });
});

// Reset Password (with code)
const resetPassword = asyncWrapper(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.resetCode || !user.resetCodeExpire) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }
  if (user.resetCode !== code || user.resetCodeExpire < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = undefined;
  user.resetCodeExpire = undefined;
  await user.save();
  res.json({ message: "Password reset successfully" });
});

// Get All Users (protected)
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find(
    {},
    {
      password: 0,
      resetCode: 0,
      resetCodeExpire: 0,
      __v: 0,
    }
  );
  res.json(users);
});

// Get User By ID (protected)
const getUserById = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.id, {
    password: 0,
    resetCode: 0,
    resetCodeExpire: 0,
    __v: 0,
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Delete User By ID (protected)
const deleteUser = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await user.deleteOne();
  res.json({ message: "User deleted" });
});

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  deleteUser,
};