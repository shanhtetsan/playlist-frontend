import { Routes, Route } from "react-router-dom";
import PlaylistList from "./pages/PlaylistList";
import PlaylistDetail from "./pages/PlaylistDetail";
import { useNowPlaying } from "./NowPlayingContext";
import formatDuration from "./utils/formatDuration";

function App() {
  const { nowPlaying } = useNowPlaying();

  return (
    <div>
      <Routes>
        <Route path="/" element={<PlaylistList />} />
        <Route path="/playlists/:id" element={<PlaylistDetail />} />
      </Routes>

      {nowPlaying && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#222", color: "#fff", padding: "10px" }}>
          Now Playing: {nowPlaying.title} — {nowPlaying.artist} ({formatDuration(nowPlaying.duration)})
        </div>
      )}
    </div>
  );
}

export default App;