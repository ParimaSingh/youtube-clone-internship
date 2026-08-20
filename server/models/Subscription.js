const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["Free", "Bronze", "Silver", "Gold"],
      required: true,
      default: "Free",
    },

    dailyDownloadLimit: {
      type: Number,
      required: true,
      default: 1,
    },

    monthlyDownloadLimit: {
      type: Number,
      default: null,
    },

    startDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);