const express = require("express");
const { signup, login, logout } = require("../controllers/authController");

const router = express.Router();

router.get("/signup", (req, res) => res.render("signup"));
router.get("/login", (req, res) => res.render("login"));
router.get("/logout", (req, res) => res.render("logout"));



router.get("/logout-success", (req, res) => {res.render("logout-success")});




router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout)

module.exports = router; 
