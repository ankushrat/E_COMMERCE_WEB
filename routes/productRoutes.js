const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", productController.getAllProducts);
router.get("/product/:id",authMiddleware, productController.getProductById);

module.exports = router;


