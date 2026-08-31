const express = require("express");

const {
  createSubscription,
  getActiveSubscription,
  getSubscriptionPlans,
} = require("../controllers/subscriptionController");

const router = express.Router();

// Get all subscription plans
router.get("/plans", getSubscriptionPlans);

// Create / activate subscription
router.post("/", createSubscription);

// Get active subscription for a user
router.get("/:userId", getActiveSubscription);

module.exports = router;