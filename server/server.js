
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");

const videoRoutes = require("./routes/videoRoutes");
const roomRoutes = require("./routes/roomRoutes");
const app = express();
const PORT = 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    console.log(`${socket.id} joined room: ${roomId}`);

    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
    });
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);

    console.log(`${socket.id} left room: ${roomId}`);

    socket.to(roomId).emit("user-left", {
      socketId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});


app.use("/api/videos", videoRoutes);
app.use("/api/rooms", roomRoutes);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});