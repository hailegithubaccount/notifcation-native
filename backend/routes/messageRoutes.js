// const express = require("express");
// const router = express.Router();
// const Message = require("../models/message");

// // Handle user response (yes, no, or inactive)
// router.post("/respond", async (req, res) => {
//   try {
//     const { response } = req.body;

//     if (response === "yes") {
//       console.log("User clicked YES, scheduling again...");
//     } else if (response === "no") {
//       console.log("User clicked NO, stopping notifications.");
//     } else if (response === "inactive") {
//       console.log("User did not respond in 1 minute.");
//     }

//     res.json({ message: "Response recorded" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
