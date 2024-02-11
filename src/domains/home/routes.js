const express = require("express");
const router = express.Router();

//Signin
router.get("/", async (req, res) => {
  res.status(200).json({ message: "Application is working" });
});

module.exports = router;
