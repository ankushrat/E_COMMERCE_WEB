const express = require("express");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction"); 
const authMiddleware = require("../middlewares/authMiddleware");

const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// **1. Homepage Route (Render EJS)**
router.get("/", (req, res) => {
    res.render("home");
});

// **2. Create Order & Render Payment Page**
router.post("/create-order",authMiddleware, async (req, res) => {
    if (!req.user) return res.status(401).send("Login required");
    const amount = req.body.amount * 100; // Convert to paise
    const currency = "INR";

    try {
        const order = await razorpay.orders.create({ amount, currency });
        const newOrder = new Order({
            order_id: order.id,
            amount,
            currency,
            status: "pending"
        });
        await newOrder.save();

        // Payment Page Render with Order Details
        res.render("payment", { order, razorpay_key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating order");
    }
});


// **Payment Success Route (Save Transaction in Database)**
router.post("/payment-success", async (req, res) => {
    const { order_id, payment_id } = req.body;

    try {
        const order = await Order.findOne({ order_id });

        if (!order) {
            return res.status(404).send("Order not found");
        }

        // **Update Order Status to "paid"**
        order.status = "paid";
        await order.save();

        // **Save Transaction Details in Database**
        const transaction = new Transaction({
            order_id,
            payment_id,
            amount: order.amount,
            currency: order.currency,
            status: "paid"
        });
        await transaction.save();

        res.render("success", { order_id });

    } catch (error) {
        console.log(error);
        res.status(500).send("Payment verification failed");
    }
});


// **4. Payment Failure Handling with Refund**
router.post("/payment-failed", async (req, res) => {
    const { order_id, payment_id } = req.body;

    try {
        const order = await Order.findOne({ order_id });

        if (!order) {
            return res.status(404).send("Order not found");
        }

        // **Update order status to "failed"**
        order.status = "failed";
        await order.save();

        // **Initiate Refund via Razorpay**
        if (payment_id) {
            const refund = await razorpay.payments.refund(payment_id, {
                amount: order.amount, // Refund full amount
                speed: "normal" // Normal refund process
            });

            console.log(`Refund Successful: ${refund.id}`);
        }

        // **Show failure page with refund message**
        res.render("failure", {
            message: "Your payment has failed. The amount will be refunded shortly. Please try again."
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Payment failure handling failed");
    }
});

module.exports = router;



