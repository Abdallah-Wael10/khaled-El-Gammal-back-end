const Customize = require("../model/customize.model");
const asyncWrapper = require("../middleware/asyncwrapper");

// Create Customize (user fills form with images)
const createCustomize = asyncWrapper(async (req, res) => {
  const { name, email, phone, comment, status } = req.body;
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map(file => file.filename);
  }
  const customize = new Customize({
    name,
    email,
    phone,
    comment,
    image: images,
    status
  });
  await customize.save();
  res.status(201).json(customize);
});

// Get All Customizes (protected)
const getAllCustomizes = asyncWrapper(async (req, res) => {
  const customizes = await Customize.find({}, { __v: false });
  res.json(customizes);
});

// Get Customize By ID (protected)
const getCustomizeById = asyncWrapper(async (req, res) => {
  const customize = await Customize.findById(req.params.id, { __v: false });
  if (!customize) return res.status(404).json({ message: "Customize not found" });
  res.json(customize);
});

// Delete Customize (protected)
const deleteCustomize = asyncWrapper(async (req, res) => {
  const customize = await Customize.findById(req.params.id);
  if (!customize) return res.status(404).json({ message: "Customize not found" });
  await customize.deleteOne();
  res.json({ message: "Customize deleted" });
});

// Update Customize (protected)
const updateCustomize = asyncWrapper(async (req, res) => {
  const customize = await Customize.findById(req.params.id);
  if (!customize) return res.status(404).json({ message: "Customize not found" });

  const { name, email, phone, comment, status } = req.body;

  // Handle images if sent
  let images = customize.image;
  if (req.files && req.files.length > 0) {
    images = req.files.map(file => file.filename);
  }

  customize.name = name ?? customize.name;
  customize.email = email ?? customize.email;
  customize.phone = phone ?? customize.phone;
  customize.comment = comment ?? customize.comment;
  customize.status = status ?? customize.status;
  customize.image = images;

  await customize.save();
  res.json(customize);
});

module.exports = {
  createCustomize,
  getAllCustomizes,
  getCustomizeById,
  deleteCustomize,
  updateCustomize,
};