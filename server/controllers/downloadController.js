const User = require("../models/user");
const Subscription = require("../models/Subscription");
const Video = require("../models/Video");
const Download = require("../models/Download");

const DOWNLOAD_LIMITS = require("../config/downloadLimits");

const getStartOfDay = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const getEndOfDay = () => {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
};

const getRemainingDailyQuota = async (userId, plan) => {
  const limit = DOWNLOAD_LIMITS[plan]?.daily ?? 0;

  const startOfDay = getStartOfDay();
  const endOfDay = getEndOfDay();

  const downloadsToday = await Download.countDocuments({
    userId,
    downloadDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: {
      $in: ["pending", "completed"],
    },
  });

  return Math.max(limit - downloadsToday, 0);
};

const checkDownloadAuthorization = async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    if (!userId || !videoId) {
      return res.status(400).json({
        message: "userId and videoId are required",
      });
    }

    // 1. Check user
    const user = await User.findById(userId);

if (!user) {
  return res.status(404).json({
    message: "User not found",
  });
}

if (deviceId && user.registeredDevices?.length > 0) {
  const registeredDevice = user.registeredDevices.find(
    (device) => device.deviceId === deviceId
  );

  if (!registeredDevice) {
    return res.status(403).json({
      message: "Download is not allowed from this device",
    });
  }
}

if (!user.isActive) {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }

    // 2. Check video
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // 3. Check subscription
    const subscription = await Subscription.findOne({
      userId,
      isActive: true,
    }).sort({ expiryDate: -1 });

    if (!subscription) {
      return res.status(403).json({
        message: "No active subscription found",
      });
    }

    // 4. Check subscription expiry
    const now = new Date();

    if (subscription.expiryDate <= now) {
      return res.status(403).json({
        message: "Subscription has expired",
      });
    }

    // 5. Check plan
    const plan = subscription.plan;

    if (!DOWNLOAD_LIMITS[plan]) {
      return res.status(403).json({
        message: "Invalid subscription plan",
      });
    }

    // 6. Check daily quota
    const remainingQuota = await getRemainingDailyQuota(
      userId,
      plan
    );
const isDeviceRegistered = user.registeredDevices?.some(
  (device) => device.deviceId === deviceId
);

if (!isDeviceRegistered) {
  return res.status(403).json({
    message: "Device is not registered for this user",
  });
}
    if (remainingQuota <= 0) {
      return res.status(403).json({
        message: "Daily download limit reached",
        remainingQuota: 0,
      });
    }

    // 7. Check duplicate download
    const duplicateWindow = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const existingDownload = await Download.findOne({
      userId,
      videoId,
      downloadDate: {
        $gte: duplicateWindow,
      },
      status: {
        $in: ["pending", "completed"],
      },
    });

    if (existingDownload) {
      return res.status(409).json({
        message: "This video has already been downloaded recently",
        remainingQuota,
      });
    }

    // 8. Authorization successful
    return res.status(200).json({
      authorized: true,
      message: "Download authorized",
      video: {
        id: video._id,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        videoUrl: video.videoUrl,
      },
      subscriptionPlan: plan,
      remainingQuota,
    });
  } catch (error) {
    console.error("Download authorization error:", error);

    return res.status(500).json({
      message: "Failed to authorize download",
      error: error.message,
    });
  }
};
const createDownload = async (req, res) => {
  try {
    const {
      userId,
      videoId,
      subscriptionPlan,
      fileSize = 0,
      deviceId = "",
    } = req.body;

    if (!userId || !videoId || !subscriptionPlan) {
      return res.status(400).json({
        message: "userId, videoId and subscriptionPlan are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const subscription = await Subscription.findOne({
      userId,
      isActive: true,
    }).sort({ expiryDate: -1 });

    if (!subscription) {
      return res.status(403).json({
        message: "No active subscription found",
      });
    }

    const now = new Date();

    if (subscription.expiryDate <= now) {
      return res.status(403).json({
        message: "Subscription has expired",
      });
    }

    if (subscription.plan !== subscriptionPlan) {
      return res.status(403).json({
        message: "Subscription plan mismatch",
      });
    }


const registeredDevice = user.registeredDevices?.find(
  (device) => device.deviceId === deviceId
);

if (!registeredDevice) {
  return res.status(403).json({
    message: "Device is not registered",
  });
}
    const remainingQuota = await getRemainingDailyQuota(
      userId,
      subscription.plan
    );

    if (remainingQuota <= 0) {
      return res.status(403).json({
        message: "Daily download limit reached",
        remainingQuota: 0,
      });
    }

    const duplicateWindow = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const existingDownload = await Download.findOne({
      userId,
      videoId,
      downloadDate: {
        $gte: duplicateWindow,
      },
      status: {
        $in: ["pending", "completed"],
      },
    });

    if (existingDownload) {
      return res.status(409).json({
        message: "This video has already been downloaded recently",
        remainingQuota,
      });
    }

    const download = await Download.create({
      userId,
      videoId,
      subscriptionPlan: subscription.plan,
      downloadDate: new Date(),
      status: "pending",
      fileSize,
      ipAddress: req.ip || "",
      deviceInfo: req.headers["user-agent"] || "",
      browser: req.headers["user-agent"] || "",
      deviceId,
      quotaAtDownload: remainingQuota,
    });

    return res.status(201).json({
      message: "Download record created",
      downloadId: download._id,
      status: download.status,
      subscriptionPlan: download.subscriptionPlan,
      remainingQuota: Math.max(remainingQuota - 1, 0),
      video: {
        id: video._id,
        title: video.title,
        videoUrl: video.videoUrl,
      },
    });
  } catch (error) {
    console.error("Create download error:", error);

    return res.status(500).json({
      message: "Failed to create download record",
      error: error.message,
    });
  }
};
const completeDownload = async (req, res) => {
  try {
    const { downloadId } = req.body;

    if (!downloadId) {
      return res.status(400).json({
        message: "downloadId is required",
      });
    }

    const download = await Download.findById(downloadId);

    if (!download) {
      return res.status(404).json({
        message: "Download record not found",
      });
    }

    if (download.status === "completed") {
      return res.status(409).json({
        message: "Download is already completed",
      });
    }

    if (download.status === "failed") {
      return res.status(409).json({
        message: "Failed download cannot be completed",
      });
    }

    if (download.status === "interrupted") {
      return res.status(409).json({
        message: "Interrupted download cannot be completed",
      });
    }

    download.status = "completed";
    download.downloadCompletedAt = new Date();

    await download.save();

    return res.status(200).json({
      message: "Download completed successfully",
      downloadId: download._id,
      status: download.status,
      downloadCompletedAt: download.downloadCompletedAt,
    });
  } catch (error) {
    console.error("Complete download error:", error);

    return res.status(500).json({
      message: "Failed to complete download",
      error: error.message,
    });
  }
};
const failDownload = async (req, res) => {
  try {
    const { downloadId } = req.body;

    if (!downloadId) {
      return res.status(400).json({
        message: "downloadId is required",
      });
    }

    const download = await Download.findById(downloadId);

    if (!download) {
      return res.status(404).json({
        message: "Download record not found",
      });
    }

    if (download.status === "completed") {
      return res.status(409).json({
        message: "Completed download cannot be marked as failed",
      });
    }

    if (download.status === "failed") {
      return res.status(409).json({
        message: "Download is already marked as failed",
      });
    }

    download.status = "failed";

    await download.save();

    return res.status(200).json({
      message: "Download marked as failed",
      downloadId: download._id,
      status: download.status,
    });
  } catch (error) {
    console.error("Fail download error:", error);

    return res.status(500).json({
      message: "Failed to update download status",
      error: error.message,
    });
  }
};


const interruptDownload = async (req, res) => {
  try {
    const { downloadId } = req.body;

    if (!downloadId) {
      return res.status(400).json({
        message: "downloadId is required",
      });
    }

    const download = await Download.findById(downloadId);

    if (!download) {
      return res.status(404).json({
        message: "Download record not found",
      });
    }

    if (download.status === "completed") {
      return res.status(409).json({
        message: "Completed download cannot be interrupted",
      });
    }

    if (download.status === "interrupted") {
      return res.status(409).json({
        message: "Download is already interrupted",
      });
    }

    download.status = "interrupted";

    await download.save();

    return res.status(200).json({
      message: "Download marked as interrupted",
      downloadId: download._id,
      status: download.status,
    });
  } catch (error) {
    console.error("Interrupt download error:", error);

    return res.status(500).json({
      message: "Failed to update download status",
      error: error.message,
    });
  }
};
module.exports = {
  checkDownloadAuthorization,
  createDownload,
completeDownload,
failDownload,
interruptDownload,
};