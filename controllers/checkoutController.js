const Cart = require("../models/cartModel");
const Order = require("../models/Order");

exports.getCheckoutPage = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    let cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) return res.redirect("/cart");

    res.render("checkout", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading checkout page");
  }
};

exports.processPayment = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    let cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) return res.redirect("/cart");

    // Create new order
    const order = new Order({
      user: req.user.userId,
      items: cart.items,
      totalAmount: cart.items.reduce(
        (total, item) => total + item.quantity * item.product.price,
        0
      ),
      status: "Paid",
    });
    await order.save();

    // Clear the cart
    await Cart.findOneAndDelete({ user: req.user.userId });

    res.redirect("/order-success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Payment failed");
  }
};

exports.orderSuccessPage = (req, res) => {
  res.render("order-success");
};
