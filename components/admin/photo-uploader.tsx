"use client";

import { createPhotoAction } from "@/lib/actions";
import { STORAGE_BUCKETS } from "@/lib/config";
import { uploadToBucket } from "@/lib/upload";
import { useState } from "react";

export function PhotoUploader({ albumId }: { albumId?: string }) {
  const [status, setStatus] = useState<string | null>(null);

  return (
    <form
      className="widget"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const file = (form.elements.namedItem("file") as HTMLInputElement).files?.[0];
        const caption = (form.elements.namedItem("caption") as HTMLInputElement).value;
        if (!file) {
          setStatus("请选一张照片");
          return;
        }
        setStatus("上传中…");
        try {
          const { path } = await uploadToBucket(STORAGE_BUCKETS.photos, file);
          const result = await createPhotoAction(path, caption, albumId);
          setStatus(result.error ?? "贴上墙了！");
          form.reset();
        } catch (error) {
          setStatus(error instanceof Error ? error.message : "上传失败");
        }
      }}
    >
      <div className="widget-title">上传照片</div>
      <div className="widget-body space-y-2">
        <input className="field" type="file" name="file" accept="image/*" />
        <input className="field" name="caption" placeholder="这张是…" />
        <button className="btn-3d" type="submit">
          贴上墙
        </button>
        {status ? <p className="text-xs">{status}</p> : null}
      </div>
    </form>
  );
}
