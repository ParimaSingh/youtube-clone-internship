const Video = require("../models/Video");

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch videos",
      error: error.message,
    });
  }
};

const createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create video",
      error: error.message,
    });
  }
};

module.exports = {
  getVideos,
  createVideo,
};