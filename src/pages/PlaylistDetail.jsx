import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import formatDuration from "../utils/formatDuration";
import { useNowPlaying } from "../NowPlayingContext";
import lookupTrack from "../utils/lookupTrack";

function PlaylistDetail() {
  const { id } = useParams();
  const { setNowPlaying } = useNowPlaying();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [editingSongId, setEditingSongId] = useState(null);
  const [editSongTitle, setEditSongTitle] = useState("");
  const [editSongArtist, setEditSongArtist] = useState("");
  const [editSongDuration, setEditSongDuration] = useState("");

  const [songSearch, setSongSearch] = useState("");
  const [minDuration, setMinDuration] = useState("");

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

  function startEditingSong(song) {
    setEditingSongId(song.id);
    setEditSongTitle(song.title);
    setEditSongArtist(song.artist);
    setEditSongDuration(song.duration);
  }

  async function handleUpdateSong(e, songId) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/songs/${songId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editSongTitle,
          artist: editSongArtist,
          duration: Number(editSongDuration),
        }),
      });
      if (!res.ok) throw new Error("Failed to update song");
      const updatedSong = await res.json();
      setPlaylist({
        ...playlist,
        Songs: playlist.Songs.map((song) =>
          song.id === songId ? updatedSong : song
        ),
      });
      setEditingSongId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMoveSong(songId, direction) {
    const currentIndex = playlist.Songs.findIndex((song) => song.id === songId);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= playlist.Songs.length) return;

    const reordered = [...playlist.Songs];
    [reordered[currentIndex], reordered[newIndex]] = [reordered[newIndex], reordered[currentIndex]];

    try {
      const res = await fetch(`http://localhost:3000/playlists/${id}/songs/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songIds: reordered.map((song) => song.id) }),
      });
      if (!res.ok) throw new Error("Failed to reorder songs");
      const updatedSongs = await res.json();
      setPlaylist({ ...playlist, Songs: updatedSongs });
    } catch (err) {
      setError(err.message);
    }
  }

async function handlePlaySong(song) {
  setNowPlaying({ ...song, audioDbMatch: null, audioDbLoading: true });
  try {
    const match = await lookupTrack(song.artist, song.title);
    setNowPlaying({ ...song, audioDbMatch: match, audioDbLoading: false });
  } catch (err) {
    setNowPlaying({ ...song, audioDbMatch: null, audioDbLoading: false });
  }
}

  if (loading) return <p>Loading playlist...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredSongs = playlist.Songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(songSearch.toLowerCase()) ||
      song.artist.toLowerCase().includes(songSearch.toLowerCase());
    const matchesDuration = minDuration === "" || song.duration >= Number(minDuration);
    return matchesSearch && matchesDuration;
  });

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
          <p>
            Total duration:{" "}
            {formatDuration(
              playlist.Songs.reduce((sum, song) => sum + song.duration, 0)
            )}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit Playlist</button>
        </>
      )}

      <h2>Songs</h2>
      <input
        type="text"
        placeholder="Search songs..."
        value={songSearch}
        onChange={(e) => setSongSearch(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min duration (seconds)"
        value={minDuration}
        onChange={(e) => setMinDuration(e.target.value)}
      />
      <ul>
        {filteredSongs.map((song) =>
          editingSongId === song.id ? (
            <li key={song.id}>
              <form onSubmit={(e) => handleUpdateSong(e, song.id)}>
                <input
                  type="text"
                  value={editSongTitle}
                  onChange={(e) => setEditSongTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editSongArtist}
                  onChange={(e) => setEditSongArtist(e.target.value)}
                />
                <input
                  type="number"
                  value={editSongDuration}
                  onChange={(e) => setEditSongDuration(e.target.value)}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingSongId(null)}>Cancel</button>
              </form>
            </li>
          ) : (
            <li key={song.id}>
              {song.title} — {song.artist} ({formatDuration(song.duration)})
              <button onClick={() => handlePlaySong(song)}>▶ Play</button>
              <button onClick={() => handleMoveSong(song.id, "up")}>↑</button>
              <button onClick={() => handleMoveSong(song.id, "down")}>↓</button>
              <button onClick={() => startEditingSong(song)}>Edit</button>
              <button onClick={() => handleDeleteSong(song.id)}>Delete</button>
            </li>
          )
        )}
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