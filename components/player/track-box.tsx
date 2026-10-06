import { MiniPlayer } from "@/components/player/mini-player";

export function TrackBox() {
  return (
    <section className="panel guest-panel">
      <h3 className="panel-title">BGM</h3>
      <div className="panel-body">
        <MiniPlayer />
      </div>
    </section>
  );
}
