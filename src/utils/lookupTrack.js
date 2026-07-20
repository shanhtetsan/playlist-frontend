async function lookupTrack(artist, title) {
  const url = `https://www.theaudiodb.com/api/v1/json/123/searchtrack.php?s=${encodeURIComponent(artist.trim())}&t=${encodeURIComponent(title.trim())}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("AudioDB request failed");
  const data = await res.json();
  return data.track ? data.track[0] : null;
}

export default lookupTrack;