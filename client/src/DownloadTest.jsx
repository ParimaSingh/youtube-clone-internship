import { useState } from "react";

const API_URL = "https://youtube-clone-internship-e5dm.onrender.com";

const TEST_USERS = {
  Free: {
    userId: "6a958aeb6d13636d631e98c3",
    deviceId: "task2-free-device",
  },
  Bronze: {
    userId: "6a958aeb6d13636d631e98c5",
    deviceId: "task2-bronze-device",
  },
  Silver: {
    userId: "6a958aeb6d13636d631e98c7",
    Id: "task2-silver-device",
  },
  Gold: {
    userId: "6a958aeb6d13636d631e98c9",
    deviceId: "task2-gold-device",
  },
};

const VIDEO_ID = "6a958aeb6d13636d631e98d2";

function DownloadTest() {
  const [plan, setPlan] = useState("Free");
  const [message, setMessage] = useState("");
  const [remainingQuota, setRemainingQuota] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);

 const user = TEST_USERS[plan];

  const authorizeDownload = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/downloads/authorize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.userId,
            videoId: VIDEO_ID,
            deviceId: user.deviceId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Authorization failed");
        setRemainingQuota(data.remainingQuota ?? null);
        return;
      }

      setRemainingQuota(data.remainingQuota);

      setMessage(
        `Download authorized successfully. Remaining quota: ${data.remainingQuota}`
      );

      await createDownload();
    } catch (error) {
      console.error(error);
      setMessage("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const createDownload = async () => {
    try {
      const response = await fetch(`${API_URL}/api/downloads/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          videoId: VIDEO_ID,
          subscriptionPlan: plan,
          fileSize: 1000,
          deviceId: user.deviceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Download creation failed");
        return;
      }

      setRemainingQuota(data.remainingQuota);

      setMessage(
        `Download created successfully. Remaining quota: ${data.remainingQuota}`
      );

      await completeDownload(data.downloadId);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create download");
    }
  };

  const completeDownload = async (downloadId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/downloads/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            downloadId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Completion failed");
        return;
      }

      setMessage("Download completed successfully.");

      await getDownloadHistory();
    } catch (error) {
      console.error(error);
      setMessage("Failed to complete download");
    }
  };

  const getDownloadHistory = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/downloads/user/${user.userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to fetch history");
        return;
      }

      setDownloads(data.downloads || []);
      setRemainingQuota(data.remainingQuota);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch download history");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Download System - Task 2</h2>

      <div>
        <label>Subscription Plan: </label>

        <select
          value={plan}
          onChange={(event) => {
            setPlan(event.target.value);
            setDownloads([]);
            setRemainingQuota(null);
            setMessage("");
          }}
        >
          <option value="Free">Free</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>
      </div>

      <br />

      <p>
        <strong>User ID:</strong> {user.userId}
      </p>

      <p>
        <strong>Device:</strong> {user.deviceId}
      </p>

      <p>
        <strong>Video ID:</strong> {VIDEO_ID}
      </p>

      <button
        onClick={authorizeDownload}
        disabled={loading}
      >
        {loading ? "Processing..." : "Download Video"}
      </button>

      <button
        onClick={getDownloadHistory}
        style={{ marginLeft: "10px" }}
      >
        Refresh History
      </button>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {remainingQuota !== null && (
        <p>
          <strong>Remaining Daily Quota:</strong>{" "}
          {remainingQuota}
        </p>
      )}

      <hr />

      <h3>Download History</h3>

      {downloads.length === 0 ? (
        <p>No downloads found.</p>
      ) : (
        <ul>
          {downloads.map((download) => (
            <li key={download.downloadId}>
              <strong>{download.video?.title}</strong>
              <br />
              Status: {download.status}
              <br />
              Plan: {download.subscriptionPlan}
              <br />
              Remaining Quota: {download.remainingQuota}
              <br />
              Device: {download.deviceId}
              <br />
              Date:{" "}
              {new Date(download.downloadDate).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DownloadTest; 