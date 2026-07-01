require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../model/product.model");

async function backfillInitialStock() {
  const url = process.env.MONGO_URL;
  if (!url) {
    console.error("MONGO_URL is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(url);
  console.log("Connected to MongoDB");

  const products = await Product.find({
    $or: [{ initialStock: { $exists: false } }, { initialStock: null }],
  });

  if (products.length === 0) {
    console.log("All products already have initialStock.");
    await mongoose.disconnect();
    return;
  }

  for (const product of products) {
    product.initialStock = product.stock;
    await product.save();
    console.log(`Updated ${product.title}: initialStock = ${product.initialStock}`);
  }

  console.log(`Done. Backfilled ${products.length} product(s).`);
  await mongoose.disconnect();
}

backfillInitialStock().catch((err) => {
  console.error(err);
  process.exit(1);
});
