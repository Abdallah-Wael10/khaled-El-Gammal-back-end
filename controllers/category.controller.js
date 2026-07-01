const Category = require("../model/category.model");
const Product = require("../model/product.model");
const asyncWrapper = require("../middleware/asyncwrapper");

const createCategory = asyncWrapper(async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const category = new Category({ name });
  await category.save();
  res.status(201).json(category);
});

const getAllCategories = asyncWrapper(async (req, res) => {
  const categories = await Category.find({}, { __v: false }).sort({ name: 1 });
  res.json(categories);
});

const getCategoryById = asyncWrapper(async (req, res) => {
  const category = await Category.findById(req.params.id, { __v: false });
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
});

const updateCategory = asyncWrapper(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  const newName = req.body.name?.trim();
  if (!newName) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const oldName = category.name;
  if (newName !== oldName) {
    const duplicate = await Category.findOne({ name: newName });
    if (duplicate) {
      return res.status(400).json({ message: "Category already exists" });
    }

    await Product.updateMany({ category: oldName }, { category: newName });
    category.name = newName;
  }

  await category.save();
  res.json(category);
});

const deleteCategory = asyncWrapper(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  const inUse = await Product.countDocuments({ category: category.name });
  if (inUse > 0) {
    return res.status(400).json({
      message: `Category is used by ${inUse} product(s) and cannot be deleted`,
    });
  }

  await category.deleteOne();
  res.json({ message: "Category deleted" });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
