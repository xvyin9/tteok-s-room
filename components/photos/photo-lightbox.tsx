"use client";

import { useEffect, useState } from "react";

export function PhotoLightbox({
  src,
  caption,
  thumbClassName = "h-40 w-full object-cover",
}: {
  src: string;
  caption: string;
  thumbClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption || "照片"} className={thumbClassName} />
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="hompy-frame max-h-[90vh] max-w-3xl overflow-auto p-3"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={caption} className="max-h-[75vh] w-auto" />
            {caption ? <p className="mt-2 text-sm">{caption}</p> : null}
            <p className="mt-1 text-xs">点外面，或按 Esc 关闭</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
