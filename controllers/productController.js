const Product = require("../models/productModel");
const Cart = require("../models/cartModel"); //  Import Cart model

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Get cart count from database
    let cartCount = 0;
    if (req.user) {
      const cart = await Cart.findOne({ user: req.user.userId });
      cartCount = cart ? cart.items.length : 0;
    }

    res.render("home", { products, token: res.locals.token, cartCount }); // ✅ Pass cartCount
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render("product", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching product details");
  }
};

// Add a new product (Admin Only)
exports.addProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .send("Access Denied: Only admins can add products");
    }

    const { name, price, description, image } = req.body;
    const newProduct = new Product({ name, price, description, image });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product");
  }
};

// Update product (Admin Only)
exports.updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .send("Access Denied: Only admins can update products");
    }

    const { name, price, description, image } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, image },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).send("Product not found");

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating product");
  }
};

// Delete product (Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .send("Access Denied: Only admins can delete products");
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).send("Product not found");

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting product");
  }
};
