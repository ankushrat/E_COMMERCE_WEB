
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const authMiddleware = require("./middlewares/authMiddleware");



dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(authMiddleware);

// Routes Import
const authRoutes = require("./routes/authRoute");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cartController = require("./controllers/cartController");



// Routes Use
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use(cartController.getCartCount); // Cart count globally set karega
app.use("/", cartRoutes);

app.use("/", paymentRoutes);

module.exports = app;

