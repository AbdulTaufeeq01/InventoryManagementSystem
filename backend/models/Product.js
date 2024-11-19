const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  purchasePrice: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
