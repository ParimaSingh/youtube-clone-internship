const mongoose = require("mongoose");
const User = require("./models/user");

const MONGO_URI = "mongodb://127.0.0.1:27017/youtube_clone";

async function makeUserActive() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected.");

    const result = await User.updateOne(
      { email: "task2-gold@test.com" },
      { $set: { isActive: true } }
    );

    console.log("Update result:", result);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

makeUserActive();