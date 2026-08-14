const Room = require("../models/Room");

const createRoom = async (req, res) => {
  try {
    const { roomId, hostName } = req.body;

    const existingRoom = await Room.findOne({ roomId });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room already exists",
      });
    }

    const room = await Room.create({
      roomId,
      hostName,
      participants: [
        {
          name: hostName,
        },
      ],
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create room",
      error: error.message,
    });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId, name } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    room.participants.push({
      name: name,
    });

    await room.save();

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Failed to join room",
      error: error.message,
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
};