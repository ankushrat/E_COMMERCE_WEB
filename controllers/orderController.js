const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
    try {
        const { address } = req.body;
        const userId = req.user.userId;  // Assuming user is logged in
        const productId = req.params.id;

        const newOrder = new Order({ userId, productId, address });
        await newOrder.save();

        res.redirect("/payment");  // Redirect to payment page
    } catch (error) {
        console.error(error);
        res.status(500).send("Error placing order");
    }
};
