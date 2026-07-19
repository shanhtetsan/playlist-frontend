import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PlaylistList() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await fetch("http://localhost:3000/playlists");
        if (!res.ok) throw new Error("Failed to fetch playlists");
        const data = await res.json();
        setPlaylists(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylists();
  }, []);

  if (loading) return <p>Loading playlists...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Playlists</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <Link to={`/playlists/${playlist.id}`}>{playlist.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistList;