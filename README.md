# Playlist Frontend

A React (Vite) client for creating playlists and managing songs. Pairs with [playlist-backend](https://github.com/shanhtetsan/playlist-backend).

## Stack

- **React** — UI
- **Vite** — dev server / build tool
- **React Router** — client-side routing between the playlist list and detail pages

## Setup

This app expects the backend to be running at `http://localhost:3000`. Start that first — see the [playlist-backend README](https://github.com/shanhtetsan/playlist-backend).

```bash
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`, or the next open port if that one's taken).

## Pages

- **`/`** — list of all playlists, with a form to create a new one and a delete button on each
- **`/playlists/:id`** — a single playlist's detail page: name, description (editable), its songs (deletable), and a form to add a new song

## Features

- Create a playlist
- Edit a playlist's name/description
- Delete a playlist (also removes its songs, server-side)
- Add a song to a playlist
- Delete a song
- Loading and error states on every fetch
- Client-side routing — navigating between pages doesn't reload the browser

## Notes

- All API calls point at `http://localhost:3000` directly in the fetch calls. If you deploy this or change the backend port, update those URLs.
- The backend must have `cors` enabled for these requests to succeed across ports — this is already configured in `playlist-backend`.
- State updates follow an "update after success" pattern: the UI only reflects a change once the server confirms it worked, never optimistically before the request completes.
