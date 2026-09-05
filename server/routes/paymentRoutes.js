const express = require("express");

const {
  createPaymentOrder,
} = require("../controllers/paymentController");

const router = express.Router();

// Create Razorpay/mock payment order
router.post("/create-order", createPaymentOrder);

module.exports = router;