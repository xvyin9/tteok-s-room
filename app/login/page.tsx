import { LoginForm } from "@/components/admin/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <p className="mb-3 text-xs">
        <Link href="/home">« 回小窝</Link>
      </p>
      <h1 className="site-title mb-3 text-3xl">tteok 的钥匙</h1>
      <p className="mb-3 text-xs">只有 tteok 可以进后台。路过的人继续逛就好。</p>
      <LoginForm />
    </main>
  );
}
