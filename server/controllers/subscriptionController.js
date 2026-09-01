const Subscription = require("../models/Subscription");
const User = require("../models/user");
const SUBSCRIPTION_PLANS = require("../config/subscriptionPlans");

// Create or activate a subscription
const createSubscription = async (req, res) => {
  try {
    const { userId, plan } = req.body;

    if (!userId || !plan) {
      return res.status(400).json({
        message: "userId and plan are required",
      });
    }

    if (!SUBSCRIPTION_PLANS[plan]) {
      return res.status(400).json({
        message: "Invalid subscription plan",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const planDetails = SUBSCRIPTION_PLANS[plan];

    const startDate = new Date();

    const expiryDate = new Date(startDate);
    expiryDate.setDate(
      expiryDate.getDate() + planDetails.durationDays
    );

    // Deactivate any previous active subscription
    await Subscription.updateMany(
      {
        userId,
        isActive: true,
      },
      {
        $set: {
          isActive: false,
        },
      }
    );

    // Create new subscription
    const subscription = await Subscription.create({
      userId,
      plan,
      dailyDownloadLimit: planDetails.dailyDownloadLimit,
      monthlyDownloadLimit: planDetails.monthlyDownloadLimit,
      startDate,
      expiryDate,
      isActive: true,
    });

    // Synchronize User subscription information
    user.subscriptionPlan = plan;
    user.subscriptionStartDate = startDate;
    user.subscriptionExpiryDate = expiryDate;

    await user.save();

    return res.status(201).json({
      message: "Subscription activated successfully",
      subscription: {
        id: subscription._id,
        userId: subscription.userId,
        plan: subscription.plan,
        dailyDownloadLimit: subscription.dailyDownloadLimit,
        monthlyDownloadLimit: subscription.monthlyDownloadLimit,
        startDate: subscription.startDate,
        expiryDate: subscription.expiryDate,
        isActive: subscription.isActive,
      },
    });
  } catch (error) {
    console.error("Create subscription error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Get active subscription for a user
const getActiveSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const subscription = await Subscription.findOne({
      userId,
      isActive: true,
      expiryDate: {
        $gt: new Date(),
      },
    }).sort({
      createdAt: -1,
    });

    if (!subscription) {
      return res.status(404).json({
        message: "No active subscription found",
      });
    }

    return res.status(200).json({
      message: "Active subscription retrieved successfully",
      subscription,
    });
  } catch (error) {
    console.error("Get subscription error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// Get all subscription plans
const getSubscriptionPlans = (req, res) => {
  try {
    return res.status(200).json({
      message: "Subscription plans retrieved successfully",
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    console.error("Get subscription plans error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// Get subscription history for a user
const getSubscriptionHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const history = await Subscription.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Subscription history retrieved successfully",
      history,
    });
  } catch (error) {
    console.error("Get subscription history error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// Get details of the user's current subscription plan
const getSubscriptionPlanDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const subscription = await Subscription.findOne({
      userId,
      isActive: true,
      expiryDate: {
        $gt: new Date(),
      },
    }).sort({
      createdAt: -1,
    });

    if (!subscription) {
      return res.status(404).json({
        message: "No active subscription found",
      });
    }

    const planDetails = SUBSCRIPTION_PLANS[subscription.plan];

    return res.status(200).json({
      message: "Subscription plan details retrieved successfully",
      plan: subscription.plan,
      details: planDetails,
      subscription: {
        startDate: subscription.startDate,
        expiryDate: subscription.expiryDate,
        isActive: subscription.isActive,
      },
    });
  } catch (error) {
    console.error("Get subscription plan details error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  createSubscription,
  getActiveSubscription,
  getSubscriptionPlans,
 getSubscriptionHistory,
  getSubscriptionPlanDetails,
};