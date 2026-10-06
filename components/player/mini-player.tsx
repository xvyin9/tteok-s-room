"use client";

import { usePlayer } from "@/components/player/player-context";

export function MiniPlayer() {
  const { tracks, index, playing, play, pause, next, prev } = usePlayer();
  const current = tracks[index];

  return (
    <div className="player-bar widget-body">
      <div className="pixel mb-1 text-[10px] text-green-800">♪ NOW PLAYING</div>
      <div className="lcd">
        {current
          ? `${String(index + 1).padStart(2, "0")}/${String(tracks.length).padStart(2, "0")} ${current.title}`
          : "NO TRACK -- 去管理室贴 mp3"}
      </div>
      <div className="flex flex-wrap gap-1">
        <button type="button" className="btn-3d" onClick={prev}>
          I&lt;
        </button>
        {playing ? (
          <button type="button" className="btn-3d" onClick={pause}>
            暂停
          </button>
        ) : (
          <button type="button" className="btn-3d" onClick={() => play()}>
            播放
          </button>
        )}
        <button type="button" className="btn-3d" onClick={next}>
          &gt;I
        </button>
      </div>
    </div>
  );
}
