const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Usermodel");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already exists");

    //if user exist
    user = new User({ name, email, password });
    await user.save();

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).send("User not found");
    }

    console.log("User found:", user);
    if (user.password !== req.body.password) {
      return res.status(400).send("Invalid password");
    }
    // const isMatch = await bcrypt.compare(password, user.password);
    // console.log("Password match result:", isMatch);

    // if (!isMatch) {
    //   console.log("Invalid password");
    //   return res.status(400).send("Invalid password");
    // }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    console.log("JWT Token Generated:", token);

    // 4️⃣ Set the token in cookies
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access (security)
      secure: false, // Set to true in production with HTTPS
      maxAge: 3600000, // 1 hour expiration(1 hour = 3600000ms)
    });

    console.log("Login successful. Token set in cookies.");

    // 5️⃣ Redirect to the products page after login
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
};
exports.logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0), //  Expire the cookie immediately
    httpOnly: true,
    path: "/",
  });
  res.redirect("/"); //  Redirect to home after removing the token
};
