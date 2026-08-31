import VideoCall from "./VideoCall";
import DownloadTest from "./DownloadTest";
import SubscriptionDashboard from "./SubscriptionDashboard";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>StreamTube</h1>

      <VideoCall />

      <hr />

      <DownloadTest />

      <hr />

      <SubscriptionDashboard />
    </div>
  );
}

export default App;