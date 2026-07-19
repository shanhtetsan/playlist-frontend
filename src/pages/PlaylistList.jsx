import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PlaylistList() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  async function handleCreatePlaylist(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error("Failed to create playlist");
      const newPlaylist = await res.json();
      setPlaylists([...playlists, newPlaylist]);
      setName("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeletePlaylist(playlistId) {
    try {
      const res = await fetch(`http://localhost:3000/playlists/${playlistId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete playlist");
      setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading playlists...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Playlists</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <Link to={`/playlists/${playlist.id}`}>{playlist.name}</Link>
            <button onClick={() => handleDeletePlaylist(playlist.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>New Playlist</h2>
      <form onSubmit={handleCreatePlaylist}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
}

export default PlaylistList;