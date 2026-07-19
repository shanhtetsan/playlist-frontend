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

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await fetch(`http://localhost:3000/playlists/${id}`);
        if (!res.ok) throw new Error("Failed to fetch playlist");
        const data = await res.json();
        setPlaylist(data);
        setEditName(data.name);
        setEditDescription(data.description);
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

  async function handleDeleteSong(songId) {
    try {
      const res = await fetch(`http://localhost:3000/songs/${songId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete song");
      setPlaylist({
        ...playlist,
        Songs: playlist.Songs.filter((song) => song.id !== songId),
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdatePlaylist(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/playlists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });
      if (!res.ok) throw new Error("Failed to update playlist");
      const updated = await res.json();
      setPlaylist({ ...playlist, name: updated.name, description: updated.description });
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading playlist...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleUpdatePlaylist}>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h1>{playlist.name}</h1>
          <p>{playlist.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit Playlist</button>
        </>
      )}

      <h2>Songs</h2>
      <ul>
        {playlist.Songs.map((song) => (
          <li key={song.id}>
            {song.title} — {song.artist} ({song.duration}s)
            <button onClick={() => handleDeleteSong(song.id)}>Delete</button>
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