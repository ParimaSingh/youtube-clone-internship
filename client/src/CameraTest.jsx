import { useEffect, useRef } from "react";

function CameraTest() {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        console.log("Camera started successfully");

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera/Microphone error:", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h1>Camera Test</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="500"
      />
    </div>
  );
}

export default CameraTest;