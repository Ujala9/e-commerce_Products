const fs = require("fs")
const { initializeDatabase } = require("./db/db.connect.js")
const  Product = require("./model/product.model.js")
const Category = require("./model/category.model.js")
initializeDatabase()

const express = require("express")
require("dotenv").config()
const app = express()

const cors = require("cors")
app.use(cors());
app.use(express.json());

//Load JSON file
// const products = JSON.parse(fs.readFileSync("./product.json", "utf-8"));
// const categories = JSON.parse(fs.readFileSync("./categories.json", "utf-8"));

const seedProductsData = async () => {
  try {
    await Product.deleteMany({});

    for (const item of products) {
      // Find the category ObjectId from the Category collection
      const categoryDoc = await Category.findOne({ name: item.category });

      if (!categoryDoc) {
        console.warn(`Category "${item.category}" not found for product "${item.name}"`);
        continue; // Skip this product if no matching category found
      }

      const newProduct = new Product({
        name: item.name,
        brand: item.brand,
        category: categoryDoc._id, // Use referenced ObjectId
        price: item.price,
        rating: item.rating,
        image: item.image,
        description: item.description
      });

      await newProduct.save();
    }

    console.log("Products seeded");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

//seedProductsData()

 const seedCategories = async () => {
  try {
    //await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log("Categories seeded");
    process.exit();
  } catch (err) {
    console.error("Error seeding categories:", err);
    process.exit(1);
  }
};

//seedCategories();
  
app.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});


app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find({});
   res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/api/categories/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});



  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});