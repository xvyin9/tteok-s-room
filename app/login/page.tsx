import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/config";
import { getStaff } from "@/lib/queries";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const staff = await getStaff();
  if (staff) redirect("/admin");
  return (
    <div className="mx-auto max-w-sm px-3 py-16">
      <div className="hompy-frame p-4">
        <h1 className="site-title text-2xl">管理室门口</h1>
        <p className="mb-4 text-xs">
          {isSupabaseConfigured()
            ? "只有 tteok 和朋友可以进去。"
            : "数据库还没接上。把 Supabase 网址和 anon key 写进 .env.local，执行 supabase/migrations/001_init.sql，再建两个账号。"}
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
