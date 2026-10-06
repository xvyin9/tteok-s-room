"use client";

import { loginAction } from "@/lib/actions";
import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      action={async (formData) => {
        const result = await loginAction(formData);
        if (result?.error) setError(result.error);
      }}
    >
      <label className="block text-xs">
        邮箱
        <input className="field mt-1" type="email" name="email" required />
      </label>
      <label className="block text-xs">
        密码
        <input className="field mt-1" type="password" name="password" required />
      </label>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      <button className="btn-3d w-full" type="submit">
        进入管理室
      </button>
    </form>
  );
}
