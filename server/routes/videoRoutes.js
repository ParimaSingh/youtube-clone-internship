const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Video API is working!",
  });
});

module.exports = router;