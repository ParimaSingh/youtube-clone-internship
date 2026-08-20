const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    registeredDevices: [
      {
        deviceId: String,
        deviceName: String,
        lastUsedAt: Date,
      },
    ],

    subscriptionPlan: {
      type: String,
      enum: ["Free", "Bronze", "Silver", "Gold"],
      default: "Free",
    },

    subscriptionStartDate: {
      type: Date,
      default: null,
    },

    subscriptionExpiryDate: {
      type: Date,
      default: null,
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

module.exports = mongoose.model("User", userSchema);