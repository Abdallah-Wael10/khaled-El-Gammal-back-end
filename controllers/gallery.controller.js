const Gallery = require("../model/gallery.model");
const asyncWrapper = require("../middleware/asyncwrapper");
const fs = require("fs");
const path = require("path");

// Create Gallery Item
const createGallery = asyncWrapper(async (req, res) => {
  const { title } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }
  const image = req.file.filename;
  const gallery = new Gallery({ title, image });
  await gallery.save();
  res.status(201).json(gallery);
});

// Get All Gallery Items
const getAllGallery = asyncWrapper(async (req, res) => {
  const gallery = await Gallery.find({}, { __v: false });
  res.json(gallery);
});

// Get Gallery Item By ID
const getGalleryById = asyncWrapper(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id, { __v: false });
  if (!gallery) return res.status(404).json({ message: "Gallery item not found" });
  res.json(gallery);
});

// Update Gallery Item
const updateGallery = asyncWrapper(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);
  if (!gallery) return res.status(404).json({ message: "Gallery item not found" });

  const { title } = req.body;

  // Handle image update
  if (req.file) {
    // Remove old image
    try {
      fs.unlinkSync(path.join('uploads', gallery.image));
    } catch (e) {}
    gallery.image = req.file.filename;
  }

  gallery.title = title ?? gallery.title;

  await gallery.save();
  res.json(gallery);
});

// Delete Gallery Item
const deleteGallery = asyncWrapper(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);
  if (!gallery) return res.status(404).json({ message: "Gallery item not found" });

  // Remove image from disk
  try {
    fs.unlinkSync(path.join('uploads', gallery.image));
  } catch (e) {}

  await gallery.deleteOne();
  res.json({ message: "Gallery item deleted" });
});

module.exports = {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery
};