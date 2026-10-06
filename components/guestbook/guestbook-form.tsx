"use client";

import { signGuestbookAction } from "@/lib/actions";
import { useState } from "react";

export function GuestbookForm() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  return (
    <form
      className="widget"
      action={async (formData) => {
        setOk(false);
        const result = await signGuestbookAction(formData);
        if (result.error) {
          setError(result.error);
          return;
        }
        setError(null);
        setOk(true);
        (document.getElementById("gb-form") as HTMLFormElement | null)?.reset();
      }}
      id="gb-form"
    >
      <div className="widget-title">写下你的名字</div>
      <div className="widget-body space-y-2">
        <label className="block text-xs">
          昵称
          <input name="nickname" className="field mt-1" maxLength={24} required />
        </label>
        <label className="block text-xs">
          留言
          <textarea name="body" className="field mt-1 h-24" maxLength={500} required />
        </label>
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
        {ok ? <p className="text-xs text-green-700">收到了！谢谢光临。</p> : null}
        <button className="btn-3d" type="submit">
          送出留言
        </button>
      </div>
    </form>
  );
}
