import VideoCall from "./VideoCall";
import DownloadTest from "./DownloadTest";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>StreamTube</h1>

      <VideoCall />

      <hr />

      <DownloadTest />
    </div>
  );
}

export default App;