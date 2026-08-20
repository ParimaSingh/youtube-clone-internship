const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    subscriptionPlan: {
      type: String,
      enum: ["Free", "Bronze", "Silver", "Gold"],
      required: true,
    },

    downloadDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "interrupted"],
      default: "pending",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    deviceInfo: {
      type: String,
      default: "",
    },

    browser: {
      type: String,
      default: "",
    },

    deviceId: {
      type: String,
      default: "",
    },

    quotaAtDownload: {
      type: Number,
      default: 0,
    },

    downloadCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Download", downloadSchema);