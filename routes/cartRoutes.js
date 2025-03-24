const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router();

router.get("/cart", authMiddleware, cartController.getCart);
router.get("/cart/add/:id", authMiddleware, cartController.addToCart);
router.get("/cart/remove/:id", authMiddleware, cartController.removeFromCart);

router.post("/payment",authMiddleware, cartController.getPaymentPage);



module.exports = router;
