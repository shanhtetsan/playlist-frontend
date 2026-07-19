import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function PlaylistList() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await fetch(`${API_URL}/playlists`);
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
      const res = await fetch(`${API_URL}/playlists`, {
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
      const res = await fetch(`${API_URL}/playlists/${playlistId}`, {
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

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Playlists</h1>

      <input
        type="text"
        placeholder="Search playlists..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {filteredPlaylists.map((playlist) => (
          <li key={playlist.id}>
            <Link to={`/playlists/${playlist.id}`}>
              {playlist.name} ({playlist.songCount} {playlist.songCount === 1 ? "song" : "songs"})
            </Link>
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