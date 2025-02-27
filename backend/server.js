const express = require("express");
const cors = require("cors");
const connectDB = require("./db");  // ✅ Import connectDB properly
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();  // ✅ Call the function

// Routes
app.use("/", messageRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
