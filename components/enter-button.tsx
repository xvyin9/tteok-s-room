"use client";

import { incrementHits } from "@/lib/actions";
import { usePlayer } from "@/components/player/player-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EnterButton() {
  const router = useRouter();
  const { play } = usePlayer();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="btn-3d sparkle mt-4 px-8 py-3 text-lg"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void incrementHits();
        play(0);
        router.push("/home");
      }}
    >
      ★ 进入小窝 ★
    </button>
  );
}
