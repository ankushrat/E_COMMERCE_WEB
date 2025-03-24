const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    order_id: { type: String, required: true, unique: true },
    payment_id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
