// const mongoose = require("mongoose");
// require("dotenv").config();
// const Message =  require("../models/message");// Import the Message model

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Insert a new message
// const insertMessage = async () => {
//   try {
//     const newMessage = new Message({ text: "This is a manually inserted message!" });
//     await newMessage.save();
//     console.log("Message inserted successfully!");
//   } catch (error) {
//     console.error("Error inserting message:", error);
//   } finally {
//     mongoose.connection.close(); // Close connection
//   }
// };

// insertMessage();
