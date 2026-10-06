"use client";

import { loginAction } from "@/lib/actions";
import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="widget"
      action={async (formData) => {
        const result = await loginAction(formData);
        if (result?.error) setError(result.error);
      }}
    >
      <div className="widget-title">tteok 登录</div>
      <div className="widget-body space-y-2">
        <label className="block text-xs">
          密码
          <input className="field mt-1" type="password" name="password" required />
        </label>
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
        <button className="btn-3d" type="submit">
          进入后台
        </button>
      </div>
    </form>
  );
}
