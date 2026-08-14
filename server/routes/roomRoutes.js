const express = require("express");

const { createRoom, joinRoom } = require("../controllers/roomController");

const router = express.Router();

router.post("/", createRoom);
router.post("/join", joinRoom);

module.exports = router;