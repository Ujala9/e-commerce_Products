const fs = require("fs")
const { initializeDatabase } = require("./db/db.connect.js")
const  Product = require("./model/product.model.js")
initializeDatabase()

const express = require("express")
require("dotenv").config()
const app = express()

app.use(express.json());

// Load JSON file
const products = JSON.parse(fs.readFileSync("./product.json", "utf-8"));

const seedProductsData = async () => {
    try {
      for (const item of products) {
        const newEvent = new Product({
            name: item.name,
            brand: item.brand,
            category: item.category,
            price: item.price,
            rating: item.rating,
            image: item.image,
            description: item.description
        });
        await newEvent.save();
        //console.log(item.name)
      }
    
    } catch (error) {
      console.error("Error seeding events:", error);
    //   process.exit(1);
    }
  };
  
  seedProductsData();
  
app.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
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



  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});