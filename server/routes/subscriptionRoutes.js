const express = require("express");

const {
  createSubscription,
  getActiveSubscription,
  getSubscriptionPlans,
  getSubscriptionHistory,
  getSubscriptionPlanDetails,
    changeSubscriptionPlan,
    renewSubscription,
      cancelSubscription,
} = require("../controllers/subscriptionController");

const router = express.Router();

// Get all subscription plans
router.get("/plans", getSubscriptionPlans);

// Create / activate subscription
router.post("/", createSubscription);
router.post("/change-plan", changeSubscriptionPlan);
router.post("/renew", renewSubscription);
router.post("/cancel", cancelSubscription);
// Get subscription history for a user
router.get("/:userId/history", getSubscriptionHistory);

// Get current subscription plan details
router.get("/:userId/plan-details", getSubscriptionPlanDetails);

// Get active subscription for a user
router.get("/:userId", getActiveSubscription);

module.exports = router;