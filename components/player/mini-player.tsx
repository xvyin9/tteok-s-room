"use client";

import { usePlayer } from "@/components/player/player-context";

export function MiniPlayer() {
  const { tracks, index, playing, play, pause, next, prev } = usePlayer();
  const current = tracks[index];

  return (
    <div className="ipod">
      <div className="ipod-screen">
        <div className="ipod-brand">iPod</div>
        <div className="ipod-track">
          {current
            ? `${String(index + 1).padStart(2, "0")}/${String(tracks.length).padStart(2, "0")}  ${current.title}`
            : "NO TRACK"}
        </div>
        <div className="ipod-sub">{playing ? "♪ now playing" : "menu"}</div>
      </div>
      <div className="ipod-wheel">
        <button type="button" className="wheel-hit wheel-top" onClick={prev} aria-label="上一首">
          ◀◀
        </button>
        <button type="button" className="wheel-hit wheel-right" aria-label="菜单">
          MENU
        </button>
        <button type="button" className="wheel-hit wheel-bottom" onClick={next} aria-label="下一首">
          ▶▶
        </button>
        <button
          type="button"
          className="wheel-hit wheel-left"
          onClick={playing ? pause : () => play()}
          aria-label={playing ? "暂停" : "播放"}
        >
          {playing ? "❚❚" : "▶❚"}
        </button>
        <button
          type="button"
          className="wheel-center"
          onClick={playing ? pause : () => play()}
          aria-label={playing ? "暂停" : "播放"}
        />
      </div>
    </div>
  );
}
