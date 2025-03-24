const app = require("./app"); // Import Express app
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


