const Razorpay = require("razorpay");
const SUBSCRIPTION_PLANS = require("../config/subscriptionPlans");

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

module.exports = {
  createPaymentOrder,
};