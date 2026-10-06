"use client";

import { createMomentAction } from "@/lib/actions";
import { STORAGE_BUCKETS } from "@/lib/config";
import { uploadToBucket } from "@/lib/upload";
import { useState } from "react";

export function MomentComposer() {
  const [status, setStatus] = useState<string | null>(null);

  return (
    <form
      className="widget"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const body = (form.elements.namedItem("body") as HTMLTextAreaElement).value;
        const files = (form.elements.namedItem("files") as HTMLInputElement).files;
        if (!body.trim() && !files?.length) {
          setStatus("写点字或选图");
          return;
        }
        setStatus("发送中…");
        try {
          const paths: string[] = [];
          if (files) {
            for (const file of Array.from(files).slice(0, 4)) {
              const uploaded = await uploadToBucket(STORAGE_BUCKETS.momentImages, file);
              paths.push(uploaded.path);
            }
          }
          const result = await createMomentAction(body, paths);
          setStatus(result.error ?? "动态出去了！");
          form.reset();
        } catch (error) {
          setStatus(error instanceof Error ? error.message : "失败了");
        }
      }}
    >
      <div className="widget-title">写动态</div>
      <div className="widget-body space-y-2">
        <textarea className="field h-24" name="body" placeholder="今天发生了…" />
        <input className="field" type="file" name="files" accept="image/*" multiple />
        <button className="btn-3d" type="submit">
          发布
        </button>
        {status ? <p className="text-xs">{status}</p> : null}
      </div>
    </form>
  );
}
