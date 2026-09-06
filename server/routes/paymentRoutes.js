const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Create Razorpay/mock payment order
router.post("/create-order", createPaymentOrder);
router.post("/verify-payment", verifyPayment);
module.exports = router;