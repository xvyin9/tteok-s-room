"use client";

import type { Track } from "@/types/database";
import { createContext, useContext, useMemo, useRef, useState } from "react";

type PlayerContextValue = {
  tracks: Track[];
  index: number;
  playing: boolean;
  play: (i?: number) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({
  tracks,
  children,
}: {
  tracks: Track[];
  children: React.ReactNode;
}) {
  const playable = useMemo(
    () => tracks.filter((t) => t.is_active && t.external_url),
    [tracks],
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = playable[index];

  const play = (i?: number) => {
    if (!playable.length) return;
    const nextIndex = i ?? index;
    const track = playable[nextIndex];
    if (!track) return;
    setIndex(nextIndex);
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.src !== track.external_url) {
      audio.src = track.external_url;
    }
    void audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const jump = (delta: number) => {
    if (!playable.length) return;
    const nextIndex = (index + delta + playable.length) % playable.length;
    setIndex(nextIndex);
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = playable[nextIndex].external_url;
    if (playing) void audio.play();
  };

  return (
    <PlayerContext.Provider
      value={{
        tracks: playable,
        index,
        playing,
        play,
        pause,
        next: () => jump(1),
        prev: () => jump(-1),
      }}
    >
      <audio
        ref={audioRef}
        src={current?.external_url}
        onEnded={() => jump(1)}
      />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be inside PlayerProvider");
  }
  return ctx;
}
