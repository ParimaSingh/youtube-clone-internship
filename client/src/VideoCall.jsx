import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function VideoCall() {
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
const [connectionStatus, setConnectionStatus] = useState("waiting");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // -----------------------------
  // MUTE / UNMUTE MICROPHONE
  // -----------------------------
  const toggleMicrophone = () => {
    const stream = localStreamRef.current;

    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  // -----------------------------
  // CAMERA ON / OFF
  // -----------------------------
  const toggleCamera = () => {
    const stream = localStreamRef.current;

    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  };

  // -----------------------------
  // LEAVE CALL
  // -----------------------------
  const leaveCall = () => {
    const socket = socketRef.current;

    if (socket && roomId) {
      socket.emit("leave-room", roomId);
      socket.disconnect();
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    socketRef.current = null;

    setJoined(false);
    setIsMuted(false);
    setIsCameraOff(false);
setConnectionStatus("waiting");

    console.log("Call ended");
  };

  // -----------------------------
  // START VIDEO CALL
  // -----------------------------
  const startVideoCall = async () => {
    if (!roomId.trim()) {
      alert("Please enter a Room ID");
      return;
    }

    try {
      console.log("Joining room:", roomId);

      // 1. Get camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      // Show local camera
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      console.log("Camera stream ready");

      // 2. Connect Socket.IO
      const socket = io("http://localhost:5000");

      socketRef.current = socket;

      // 3. Create WebRTC connection
      const peerConnection = new RTCPeerConnection();

      peerConnectionRef.current = peerConnection;

      // Add camera and microphone tracks
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      console.log("WebRTC Peer Connection created");

      // -----------------------------
      // RECEIVE REMOTE VIDEO
      // -----------------------------
      peerConnection.ontrack = (event) => {
        console.log("Remote video track received");

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // -----------------------------
      // ICE CANDIDATE
      // -----------------------------
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            roomId: roomId,
            candidate: event.candidate,
          });

          console.log("ICE candidate sent");
        }
      };

      // -----------------------------
      // SOCKET CONNECTED
      // -----------------------------
      socket.on("connect", () => {
        console.log("WebRTC signaling connected:", socket.id);

        socket.emit("join-room", roomId);

        console.log("Joined room:", roomId);

        setJoined(true);
      });

      // -----------------------------
      // USER JOINED
      // -----------------------------
      socket.on("user-joined", async () => {
        setConnectionStatus("connected");
        try {
          console.log("Another user joined. Creating offer...");

          const offer = await peerConnection.createOffer();

          await peerConnection.setLocalDescription(offer);

          socket.emit("offer", {
            roomId: roomId,
            offer: offer,
          });

          console.log("Offer sent");
        } catch (error) {
          console.error("Error creating offer:", error);
        }
      });

      // -----------------------------
      // RECEIVE OFFER
      // -----------------------------
      socket.on("offer", async ({ offer }) => {
        try {
          console.log("Offer received");

          if (peerConnection.signalingState !== "stable") {
            console.log(
              "Ignoring offer. Current state:",
              peerConnection.signalingState
            );
            return;
          }

          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
          );

          const answer = await peerConnection.createAnswer();

          await peerConnection.setLocalDescription(answer);

          socket.emit("answer", {
            roomId: roomId,
            answer: answer,
          });

          console.log("Answer sent");
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      });

      // -----------------------------
      // RECEIVE ANSWER
      // -----------------------------
      socket.on("answer", async ({ answer }) => {
        try {
          console.log("Answer received");

          if (peerConnection.signalingState !== "have-local-offer") {
            console.log(
              "Ignoring answer. Current state:",
              peerConnection.signalingState
            );
            return;
          }

          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
          );

          console.log("Answer applied");
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      });

      // -----------------------------
      // RECEIVE ICE CANDIDATE
      // -----------------------------
      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(candidate)
          );

          console.log("ICE candidate received");
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      });
    } catch (error) {
      console.error("WebRTC error:", error);
    }
  };

  return (
    <div>
      <h1>Video Call</h1>

      {/* ROOM SECTION */}
      {!joined && (
        <div>
          <h2>Join a Room</h2>

          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
          />

          <button onClick={startVideoCall}>
            Join Room
          </button>
        </div>
      )}

      {/* VIDEO SECTION */}
      {joined && (
        <div>
          <h2>Room: {roomId}</h2>
          <p>
  {connectionStatus === "connected"
    ? "🟢 Connected to another user"
    : "🟡 Waiting for another user to join..."}
</p>

          <h3>My Camera</h3>

          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            width="500"
          />

          <div>
            <button onClick={toggleMicrophone}>
              {isMuted ? "Unmute 🎤" : "Mute 🔇"}
            </button>

            <button onClick={toggleCamera}>
              {isCameraOff
                ? "Turn Camera On 📷"
                : "Turn Camera Off 📷"}
            </button>

            <button onClick={leaveCall}>
              Leave Call 🚪
            </button>
          </div>

          <h3>Remote Camera</h3>

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            width="500"
          />
        </div>
      )}
    </div>
  );
}

export default VideoCall;