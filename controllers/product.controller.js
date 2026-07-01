const Product = require("../model/product.model");
const Category = require("../model/category.model");
const asyncWrapper = require("../middleware/asyncwrapper");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "..", "uploads");

function imageExists(filename) {
  if (!filename) return false;
  try {
    return fs.existsSync(path.join(uploadsDir, filename));
  } catch {
    return false;
  }
}

function serializeProduct(product) {
  const data = product?.toObject ? product.toObject() : product;
  if (!data) return data;

  const imageCandidates = [
    data.mainImage,
    ...(Array.isArray(data.images) ? data.images : []),
  ].filter(Boolean);
  const availableImages = imageCandidates.filter(imageExists);

  return {
    ...data,
    displayImage: availableImages[0] || data.mainImage || imageCandidates[0] || "",
    imageCandidates,
    availableImages,
  };
}

async function assertCategoryExists(categoryName) {
  if (!categoryName) return null;
  const trimmed = String(categoryName).trim();
  const category = await Category.findOne({ name: trimmed });
  if (!category) {
    const error = new Error(`Category "${trimmed}" does not exist. Add it in Product Categories first.`);
    error.status = 400;
    throw error;
  }
  return trimmed;
}

// Create Product
const createProduct = asyncWrapper(async (req, res) => {
  const {
    title,
    description,
    price,
    discountPrice,
    inStock,
    category,
    stock,
    sizes 
  } = req.body;

  const validCategory = await assertCategoryExists(category);

  if (!req.files || !req.files.mainImage || req.files.mainImage.length === 0) {
    return res.status(400).json({ message: "Main image is required" });
  }

  const mainImage = req.files.mainImage[0].filename;
  const images = req.files.images ? req.files.images.map(file => file.filename) : [];
  const stockCount = Number(stock);

  const product = new Product({
    title,
    description,
    price,
    discountPrice,
    inStock,
    category: validCategory,
    mainImage,
    images,
    stock: stockCount,
    initialStock: stockCount,
    sizes: Array.isArray(sizes) ? sizes : (sizes ? [sizes] : []) 
  });

  await product.save();
  res.status(201).json(serializeProduct(product));
});

// Get All Products
const getAllProducts = asyncWrapper(async (req, res) => {
  const products = await Product.find({}, { __v: false });
  res.json(products.map(serializeProduct));
});

// Get Product By ID
const getProductById = asyncWrapper(async (req, res) => {
  const product = await Product.findById(req.params.id, { __v: false });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(serializeProduct(product));
});

// Update Product
const updateProduct = asyncWrapper(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const {
    title,
    description,
    price,
    discountPrice,
    inStock,
    category,
    stock,
    sizes,
    oldImages // <-- الصور القديمة المتبقية بعد الحذف (من الـ frontend)
  } = req.body;

  // Handle mainImage update
  if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
    // Remove old main image
    try {
      fs.unlinkSync(path.join('uploads', product.mainImage));
    } catch (e) {}
    product.mainImage = req.files.mainImage[0].filename;
  }

  // Handle images array update (smart merge)
  let newImages = [];
  if (req.files && req.files.images && req.files.images.length > 0) {
    newImages = req.files.images.map(file => file.filename);
  }

  // oldImages: array of filenames that should remain (from frontend)
  let oldImagesArr = [];
  if (oldImages) {
    if (Array.isArray(oldImages)) {
      oldImagesArr = oldImages;
    } else if (typeof oldImages === "string") {
      oldImagesArr = [oldImages];
    }
  } else {
    oldImagesArr = product.images || [];
  }

  // Remove deleted images from disk
  product.images.forEach(img => {
    if (!oldImagesArr.includes(img)) {
      try {
        fs.unlinkSync(path.join('uploads', img));
      } catch (e) {}
    }
  });

  // Final images = oldImagesArr (remaining) + newImages (added)
  product.images = [...oldImagesArr, ...newImages];

  product.title = title ?? product.title;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.discountPrice = discountPrice ?? product.discountPrice;
  product.inStock = inStock ?? product.inStock;
  if (category !== undefined && category !== null && category !== "") {
    product.category = await assertCategoryExists(category);
  }
  if (stock !== undefined && stock !== null && stock !== "") {
    const nextStock = Number(stock);
    if (nextStock !== product.stock) {
      product.initialStock = nextStock;
    }
    product.stock = nextStock;
  }
  // Handle sizes as array of strings
  if (sizes) {
    if (Array.isArray(sizes)) {
      product.sizes = sizes;
    } else if (typeof sizes === "string") {
      product.sizes = [sizes];
    }
  }

  await product.save();
  res.json(serializeProduct(product));
});

// Delete Product
const deleteProduct = asyncWrapper(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // Remove images from disk
  try {
    fs.unlinkSync(path.join('uploads', product.mainImage));
    product.images.forEach(img => {
      fs.unlinkSync(path.join('uploads', img));
    });
  } catch (e) {}

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  serializeProduct,
};
