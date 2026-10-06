"use client";

import { replyGuestbookAction } from "@/lib/actions";
import { useState } from "react";

export function ReplyForm({ parentId }: { parentId: string }) {
  const [status, setStatus] = useState<string | null>(null);
  return (
    <form
      className="mt-2"
      action={async (formData) => {
        formData.set("parent_id", parentId);
        const result = await replyGuestbookAction(formData);
        setStatus(result.error ?? "回过了");
      }}
    >
      <textarea className="field h-16" name="body" placeholder="主人回复…" required />
      <button className="btn-3d mt-1" type="submit">
        回复
      </button>
      {status ? <p className="text-[11px]">{status}</p> : null}
    </form>
  );
}
