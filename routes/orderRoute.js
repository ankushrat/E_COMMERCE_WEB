const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware"); // Ensure this is correct

router.post("/order/:id", authMiddleware, orderController.placeOrder);

module.exports = router;
