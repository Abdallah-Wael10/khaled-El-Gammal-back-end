require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../model/product.model");
const Category = require("../model/category.model");

async function seedCategories() {
  const url = process.env.MONGO_URL;
  if (!url) {
    console.error("MONGO_URL is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(url);
  console.log("Connected to MongoDB");

  const distinctCategories = await Product.distinct("category");
  const names = distinctCategories
    .map((name) => String(name || "").trim())
    .filter(Boolean);

  if (names.length === 0) {
    console.log("No product categories found to seed.");
    await mongoose.disconnect();
    return;
  }

  let created = 0;
  for (const name of names) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      await Category.create({ name });
      created += 1;
      console.log(`Created category: ${name}`);
    } else {
      console.log(`Skipped (exists): ${name}`);
    }
  }

  console.log(`Done. ${created} new categor${created === 1 ? "y" : "ies"} created.`);
  await mongoose.disconnect();
}

seedCategories().catch((err) => {
  console.error(err);
  process.exit(1);
});
