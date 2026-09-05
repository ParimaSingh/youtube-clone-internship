require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");

const videoRoutes = require("./routes/videoRoutes");
const roomRoutes = require("./routes/roomRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;
connectDB();
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
socket.on("offer", ({ roomId, offer }) => {
  socket.to(roomId).emit("offer", {
    offer,
  });
});

socket.on("answer", ({ roomId, answer }) => {
  socket.to(roomId).emit("answer", {
    answer,
  });
});

socket.on("ice-candidate", ({ roomId, candidate }) => {
  socket.to(roomId).emit("ice-candidate", {
    candidate,
  });
});
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});


app.use("/api/videos", videoRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});