
const express = require("express");
const connectDB = require("./db");

const videoRoutes = require("./routes/videoRoutes");

const app = express();
connectDB();

const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("YouTube Clone Backend is running!");
});

app.use("/api/videos", videoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});