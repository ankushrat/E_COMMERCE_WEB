const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    order_id: String,
    payment_id: String,
    signature: String,
    amount: Number,
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "paid", "failed","pending"], default: "created" },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
