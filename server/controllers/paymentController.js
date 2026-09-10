const Razorpay = require("razorpay");
const crypto = require("crypto");
const SUBSCRIPTION_PLANS = require("../config/subscriptionPlans");
const Payment = require("../models/Payment");

const razorpayConfigured =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET;

const razorpay = razorpayConfigured
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// Create Razorpay order
const createPaymentOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        message: "Subscription plan is required",
      });
    }

    const planDetails = SUBSCRIPTION_PLANS[plan];

    if (!planDetails) {
      return res.status(400).json({
        message: "Invalid subscription plan",
      });
    }

    // Free plan does not require payment
    if (planDetails.price === 0) {
      return res.status(400).json({
        message: "Free plan does not require payment",
      });
    }

    const amount = planDetails.price * 100;

    // Real Razorpay test-mode order
    if (razorpayConfigured) {
      const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      return res.status(201).json({
        message: "Razorpay test order created successfully",
        mode: "razorpay_test",
        order,
        plan,
      });
    }

    // Mock test mode when Razorpay credentials are not configured
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      entity: "order",
      amount,
      amount_paid: 0,
      amount_due: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      status: "created",
      attempts: 0,
    };

    return res.status(201).json({
      message: "Mock payment order created successfully",
      mode: "mock_test",
      order: mockOrder,
      plan,
      planDetails,
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { status } = req.body;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
if (status === "failed" || status === "cancelled") {
  return res.status(400).json({
    message: "Payment was not successful",
    verified: false,
  });
}
const planDetails = SUBSCRIPTION_PLANS[req.body.plan];

if (!planDetails) {
  return res.status(400).json({
    message: "Invalid subscription plan",
    verified: false,
  });
}
const existingPayment = await Payment.findOne({
  razorpay_payment_id,
});

if (existingPayment) {
  return res.status(400).json({
    message: "Payment already processed",
    verified: false,
  });
}
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details are required",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment signature verification failed",
        verified: false,
      });
    }
await Payment.create({
  plan: req.body.plan,
  razorpay_order_id,
  razorpay_payment_id,
  amount: SUBSCRIPTION_PLANS[req.body.plan].price * 100,
  currency: "INR",
  status: "paid",
});
    return res.status(200).json({
      message: "Payment signature verified successfully",
      verified: true,
      razorpay_order_id,
      razorpay_payment_id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      message: "Payment verification failed",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};