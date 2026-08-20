const mongoose = require("mongoose");

const User = require("./models/user");
const Subscription = require("./models/Subscription");
const Video = require("./models/Video");

const MONGO_URI = "mongodb://127.0.0.1:27017/youtube_clone";

const createTestData = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected.");

    // Remove previous Task 2 test data
    const testEmails = [
      "task2-free@test.com",
      "task2-bronze@test.com",
      "task2-silver@test.com",
      "task2-gold@test.com",
      "task2-expired@test.com",
    ];

    const oldUsers = await User.find({
      email: { $in: testEmails },
    });

    const oldUserIds = oldUsers.map((user) => user._id);

    await Subscription.deleteMany({
      userId: { $in: oldUserIds },
    });

    await User.deleteMany({
      email: { $in: testEmails },
    });

    await Video.deleteMany({
      title: "Task 2 Test Video",
    });

    // Create users
    const freeUser = await User.create({
      name: "Task 2 Free User",
      email: "task2-free@test.com",
      subscriptionPlan: "Free",
      isActive: true,
    });

    const bronzeUser = await User.create({
      name: "Task 2 Bronze User",
      email: "task2-bronze@test.com",
      subscriptionPlan: "Bronze",
      isActive: true,
    });

    const silverUser = await User.create({
      name: "Task 2 Silver User",
      email: "task2-silver@test.com",
      subscriptionPlan: "Silver",
      isActive: true,
    });

    const goldUser = await User.create({
      name: "Task 2 Gold User",
      email: "task2-gold@test.com",
      subscriptionPlan: "Gold",
      isActive: true,
    });

    const expiredUser = await User.create({
      name: "Task 2 Expired User",
      email: "task2-expired@test.com",
      subscriptionPlan: "Gold",
      isActive: true,
    });

    // Dates
    const now = new Date();

    const activeStartDate = new Date();
    activeStartDate.setDate(activeStartDate.getDate() - 5);

    const activeExpiryDate = new Date();
    activeExpiryDate.setDate(activeExpiryDate.getDate() + 25);

    const expiredStartDate = new Date();
    expiredStartDate.setDate(expiredStartDate.getDate() - 40);

    const expiredExpiryDate = new Date();
    expiredExpiryDate.setDate(expiredExpiryDate.getDate() - 10);

    // Create subscriptions
    await Subscription.create({
      userId: freeUser._id,
      plan: "Free",
      dailyDownloadLimit: 1,
      monthlyDownloadLimit: null,
      startDate: activeStartDate,
      expiryDate: activeExpiryDate,
      isActive: true,
    });

    await Subscription.create({
      userId: bronzeUser._id,
      plan: "Bronze",
      dailyDownloadLimit: 3,
      monthlyDownloadLimit: 30,
      startDate: activeStartDate,
      expiryDate: activeExpiryDate,
      isActive: true,
    });

    await Subscription.create({
      userId: silverUser._id,
      plan: "Silver",
      dailyDownloadLimit: 5,
      monthlyDownloadLimit: 100,
      startDate: activeStartDate,
      expiryDate: activeExpiryDate,
      isActive: true,
    });

    await Subscription.create({
      userId: goldUser._id,
      plan: "Gold",
      dailyDownloadLimit: 10,
      monthlyDownloadLimit: 300,
      startDate: activeStartDate,
      expiryDate: activeExpiryDate,
      isActive: true,
    });

    await Subscription.create({
      userId: expiredUser._id,
      plan: "Gold",
      dailyDownloadLimit: 10,
      monthlyDownloadLimit: 300,
      startDate: expiredStartDate,
      expiryDate: expiredExpiryDate,
      isActive: false,
    });

    // Create test video
    const video = await Video.create({
      title: "Task 2 Test Video",
      description: "Temporary video for testing the download system.",
      videoUrl: "https://example.com/test-video.mp4",
      thumbnailUrl: "https://example.com/test-thumbnail.jpg",
      channelName: "Internship Test Channel",
    });

    console.log("\n================================");
    console.log("TASK 2 TEST DATA CREATED");
    console.log("================================");

    console.log("\nFREE USER:");
    console.log(freeUser._id.toString());

    console.log("\nBRONZE USER:");
    console.log(bronzeUser._id.toString());

    console.log("\nSILVER USER:");
    console.log(silverUser._id.toString());

    console.log("\nGOLD USER:");
    console.log(goldUser._id.toString());

    console.log("\nEXPIRED USER:");
    console.log(expiredUser._id.toString());

    console.log("\nTEST VIDEO:");
    console.log(video._id.toString());

    console.log("\n================================");
    console.log("FREE LIMIT   : 1/day");
    console.log("BRONZE LIMIT : 3/day");
    console.log("SILVER LIMIT : 5/day");
    console.log("GOLD LIMIT   : 10/day");
    console.log("================================");

  } catch (error) {
    console.error("\nTEST DATA ERROR:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("\nMongoDB disconnected.");
  }
};

createTestData();