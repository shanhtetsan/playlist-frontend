import { Routes, Route } from "react-router-dom";
import PlaylistList from "./pages/PlaylistList";
import PlaylistDetail from "./pages/PlaylistDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PlaylistList />} />
      <Route path="/playlists/:id" element={<PlaylistDetail />} />
    </Routes>
  );
}

export default App;