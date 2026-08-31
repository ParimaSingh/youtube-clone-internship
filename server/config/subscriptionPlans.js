const SUBSCRIPTION_PLANS = {
  Free: {
    dailyDownloadLimit: 1,
    monthlyDownloadLimit: null,
    durationDays: 30,
  },

  Bronze: {
    dailyDownloadLimit: 5,
    monthlyDownloadLimit: null,
    durationDays: 30,
  },

  Silver: {
    dailyDownloadLimit: 10,
    monthlyDownloadLimit: null,
    durationDays: 30,
  },

  Gold: {
    dailyDownloadLimit: 20,
    monthlyDownloadLimit: null,
    durationDays: 30,
  },
};

module.exports = SUBSCRIPTION_PLANS;