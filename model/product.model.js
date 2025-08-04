const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);


module.exports = Product
