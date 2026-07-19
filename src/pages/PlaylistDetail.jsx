import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PlaylistDetail() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");

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

  async function handleAddSong(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/playlists/${id}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, duration: Number(duration) }),
      });
      if (!res.ok) throw new Error("Failed to add song");
      const newSong = await res.json();
      setPlaylist({ ...playlist, Songs: [...playlist.Songs, newSong] });
      setTitle("");
      setArtist("");
      setDuration("");
    } catch (err) {
      setError(err.message);
    }
  }

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

      <h2>Add a Song</h2>
      <form onSubmit={handleAddSong}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <input
          type="number"
          placeholder="Duration (seconds)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button type="submit">Add Song</button>
      </form>
    </div>
  );
}

export default PlaylistDetail;