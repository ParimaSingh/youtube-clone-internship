const SUBSCRIPTION_PLANS = {
  Free: {
    price: 0,
    currency: "INR",
    validity: "30 days",
    durationDays: 30,

    dailyDownloadLimit: 1,
    monthlyDownloadLimit: null,

    streamingQuality: "480p",
    premiumVideos: "Limited",
    watchTime: "Limited",
    offlineDownloads: false,
    priorityContent: false,
    fasterStreaming: false,
    exclusiveCourses: false,
    adFree: false,
  },

  Bronze: {
    price: 199,
    currency: "INR",
    validity: "30 days",
    durationDays: 30,

    dailyDownloadLimit: 5,
    monthlyDownloadLimit: null,

    streamingQuality: "720p",
    premiumVideos: "Full access",
    watchTime: "Extended",
    offlineDownloads: true,
    priorityContent: false,
    fasterStreaming: false,
    exclusiveCourses: false,
    adFree: false,
  },

  Silver: {
    price: 399,
    currency: "INR",
    validity: "30 days",
    durationDays: 30,

    dailyDownloadLimit: 10,
    monthlyDownloadLimit: null,

    streamingQuality: "1080p",
    premiumVideos: "Full access",
    watchTime: "High",
    offlineDownloads: true,
    priorityContent: true,
    fasterStreaming: true,
    exclusiveCourses: true,
    adFree: true,
  },

  Gold: {
    price: 699,
    currency: "INR",
    validity: "30 days",
    durationDays: 30,

    dailyDownloadLimit: 20,
    monthlyDownloadLimit: null,

    streamingQuality: "4K",
    premiumVideos: "Full access",
    watchTime: "Unlimited",
    offlineDownloads: true,
    priorityContent: true,
    fasterStreaming: true,
    exclusiveCourses: true,
    adFree: true,
  },
};

module.exports = SUBSCRIPTION_PLANS;