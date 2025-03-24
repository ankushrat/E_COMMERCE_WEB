const Cart = require("../models/cartModel");
const Order = require("../models/Order");
const Razorpay = require("razorpay");

// ✅ Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getCart = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    let cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );
    if (!cart) cart = { items: [] };

    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching cart");
  }
};

exports.addToCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Login required");

    const { id } = req.params;
    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({
        user: req.user.userId,
        items: [{ product: id, quantity: 1 }],
      });
    } else {
      const item = cart.items.find((i) => i.product.toString() === id);
      if (item) item.quantity++;
      else cart.items.push({ product: id, quantity: 1 });
    }

    await cart.save();
    res.redirect("/cart"); // No change here, cart remains same
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding to cart");
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Login required");

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.redirect("/cart");

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.id
    );
    await cart.save();
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error removing from cart");
  }
};

exports.getCartCount = async (req, res, next) => {
  if (!req.user) {
    res.locals.cartCount = 0;
    return next();
  }

  const cart = await Cart.findOne({ user: req.user.userId });
  res.locals.cartCount = cart ? cart.items.length : 0;
  next();
};

// ✅ Render Payment Page with Order Details
exports.getPaymentPage = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    let cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) return res.redirect("/cart");

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    // ✅ Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paisa
      currency: "INR",
    });

    // ✅ Save order in DB
    const newOrder = new Order({
      user: req.user.userId,
      order_id: order.id,
      amount: totalAmount,
      currency: "INR",
      status: "pending",
    });

    await newOrder.save();

    // ✅ Render Payment Page
    res.render("payment", { order, razorpay_key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
};

