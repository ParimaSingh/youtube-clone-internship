
import { useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import './App.css'

function App() {
    useEffect(() => {
  const socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);

    socket.emit("join-room", "ROOM123");
    console.log("Joining room: ROOM123");
  });

  socket.on("user-joined", (data) => {
    console.log("New user joined:", data.socketId);
  });

  socket.on("user-left", (data) => {
    console.log("User left:", data.socketId);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  return () => {
    socket.emit("leave-room", "ROOM123");
    socket.disconnect();
  };
}, []);
  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">
          ▶ <span>StreamTube</span>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search videos..."
          />
          <button>🔍</button>
        </div>

        <div className="header-actions">
          <button>＋</button>
          <button>🔔</button>
          <div className="profile">P</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="layout">

        {/* Sidebar */}
        <aside className="sidebar">
          <nav>
            <a className="active">🏠 Home</a>
            <a>🔥 Trending</a>
            <a>📺 Subscriptions</a>
            <a>📚 Library</a>
            <a>🕒 History</a>
            <a>⬇️ Downloads</a>
          </nav>

          <div className="sidebar-section">
            <h3>Explore</h3>
            <a>🎓 Courses</a>
            <a>🎵 Music</a>
            <a>🎮 Gaming</a>
            <a>💻 Technology</a>
          </div>
        </aside>

        {/* Content */}
        <main className="content">

          <section className="welcome">
            <h1>Welcome to StreamTube</h1>
            <p>Watch, learn and discover amazing content.</p>
          </section>

          <div className="categories">
            <button className="selected">All</button>
            <button>Technology</button>
            <button>Programming</button>
            <button>Education</button>
            <button>Music</button>
            <button>Gaming</button>
          </div>

          <h2>Recommended Videos</h2>

          <section className="video-grid">

            <article className="video-card">
              <div className="thumbnail thumbnail-one">
                <span>▶</span>
              </div>
              <div className="video-info">
                <div className="channel-avatar">T</div>
                <div>
                  <h3>Learn Web Development From Scratch</h3>
                  <p>Tech Academy</p>
                  <p>125K views • 2 days ago</p>
                </div>
              </div>
            </article>

            <article className="video-card">
              <div className="thumbnail thumbnail-two">
                <span>▶</span>
              </div>
              <div className="video-info">
                <div className="channel-avatar">C</div>
                <div>
                  <h3>Complete JavaScript Tutorial</h3>
                  <p>Code World</p>
                  <p>89K views • 5 days ago</p>
                </div>
              </div>
            </article>

            <article className="video-card">
              <div className="thumbnail thumbnail-three">
                <span>▶</span>
              </div>
              <div className="video-info">
                <div className="channel-avatar">D</div>
                <div>
                  <h3>Build Your First Full Stack App</h3>
                  <p>Dev Studio</p>
                  <p>64K views • 1 week ago</p>
                </div>
              </div>
            </article>

            <article className="video-card">
              <div className="thumbnail thumbnail-four">
                <span>▶</span>
              </div>
              <div className="video-info">
                <div className="channel-avatar">L</div>
                <div>
                  <h3>Learn React in Easy Steps</h3>
                  <p>Learn With Us</p>
                  <p>210K views • 3 days ago</p>
                </div>
              </div>
            </article>

            <article className="video-card">
              <div className="thumbnail thumbnail-five">
                <span>▶</span>
              </div>
              <div className="video-info">
                <div className="channel-avatar">A</div>
                <div>
                  <h3>Artificial Intelligence Explained</h3>
                  <p>AI World</p>
                  <p>52K views • 4 days ago</p>
                </div>
              </div>
            </article>

            <article className="video-card">
              <div className="thumbnail thumbnail-six">
                <span>▶</span>
              </div>
              <div className="video-info">
                <div className="channel-avatar">G</div>
                <div>
                  <h3>Git and GitHub Complete Guide</h3>
                  <p>Code Guide</p>
                  <p>98K views • 1 month ago</p>
                </div>
              </div>
            </article>

          </section>

        </main>
      </div>
    </div>
  )
}

export default App
