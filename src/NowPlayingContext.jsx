import { createContext, useContext, useState } from "react";

const NowPlayingContext = createContext();

export function NowPlayingProvider({ children }) {
  const [nowPlaying, setNowPlaying] = useState(null);

  return (
    <NowPlayingContext.Provider value={{ nowPlaying, setNowPlaying }}>
      {children}
    </NowPlayingContext.Provider>
  );
}

export function useNowPlaying() {
  return useContext(NowPlayingContext);
}