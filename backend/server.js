const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb+srv://haile:haile@cluster0.bows2.mongodb.net/seat", {

  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Message Schema
const messageSchema = new mongoose.Schema({
  text: String, // Message text (e.g., "Are you in the chair?")
  status: String, // "yes", "no", "inactive"
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const Message = mongoose.model("Message", messageSchema);

// 🚀 **Staff API - Insert Message**
app.post("/addMessage", async (req, res) => {
  try {
    const { text } = req.body;
    const newMessage = new Message({ text, status: "pending" });
    await newMessage.save();
    res.status(201).json({ message: "Message added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding message" });
  }
});

// 🚀 **Student API - Fetch Latest Message**
app.get("/getMessage", async (req, res) => {
  try {
    const message = await Message.findOne().sort({ createdAt: -1 }); // Get latest message
    if (!message) {
      return res.status(404).json({ message: "No message found" });
    }
    res.json({ message: message.text });
  } catch (error) {
    res.status(500).json({ error: "Error fetching message" });
  }
});

// 🚀 **Student API - Respond to Message**
app.post("/respond", async (req, res) => {
  try {
    const { response } = req.body;
    const latestMessage = await Message.findOne().sort({ createdAt: -1 });

    if (!latestMessage) {
      return res.status(404).json({ error: "No message found" });
    }

    latestMessage.status = response;
    await latestMessage.save();

    res.json({ message: "Response saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving response" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
