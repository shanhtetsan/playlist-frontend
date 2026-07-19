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
    <p>Now Playing: {nowPlaying.title} — {nowPlaying.artist} ({formatDuration(nowPlaying.duration)})</p>
    {nowPlaying.audioDbLoading && <p>Searching AudioDB...</p>}
    {!nowPlaying.audioDbLoading && nowPlaying.audioDbMatch && (
      <p>
        Found on AudioDB: {nowPlaying.audioDbMatch.strTrack} by {nowPlaying.audioDbMatch.strArtist}
        {nowPlaying.audioDbMatch.strTrackThumb && (
          <img src={nowPlaying.audioDbMatch.strTrackThumb} alt="album art" width="50" />
        )}
      </p>
    )}
    {!nowPlaying.audioDbLoading && !nowPlaying.audioDbMatch && (
      <p>No match found on AudioDB</p>
    )}
  </div>
)}
    </div>
  );
}

export default App;