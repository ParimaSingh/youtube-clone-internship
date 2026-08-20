import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function SocketTest() {
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      setStatus("Connected! Socket ID: " + socket.id);
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Video Call Socket Test</h1>
      <p>{status}</p>
    </div>
  );
}

export default SocketTest;