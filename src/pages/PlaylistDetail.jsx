import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PlaylistDetail() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await fetch(`http://localhost:3000/playlists/${id}`);
        if (!res.ok) throw new Error("Failed to fetch playlist");
        const data = await res.json();
        setPlaylist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylist();
  }, [id]);

  if (loading) return <p>Loading playlist...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{playlist.name}</h1>
      <p>{playlist.description}</p>

      <h2>Songs</h2>
      <ul>
        {playlist.Songs.map((song) => (
          <li key={song.id}>
            {song.title} — {song.artist} ({song.duration}s)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistDetail;