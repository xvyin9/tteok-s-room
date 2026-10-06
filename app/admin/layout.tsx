import { logoutAction } from "@/lib/actions";
import { getStaff } from "@/lib/queries";
import Link from "next/link";
import { redirect } from "next/navigation";

const links = [
  ["/admin", "总览"],
  ["/admin/profile", "资料与公告"],
  ["/admin/photos", "照片"],
  ["/admin/moments", "动态"],
  ["/admin/articles", "文章"],
  ["/admin/guestbook", "留言"],
  ["/admin/music", "BGM"],
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await getStaff();
  if (!staff) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl px-2 py-4">
      <div className="hompy-frame mb-3 flex flex-wrap items-center justify-between gap-2 p-3">
        <div>
          <p className="pixel text-[10px]">STAFF ROOM</p>
          <h1 className="site-title text-2xl">管理室</h1>
          <p className="text-xs">
            {staff.display_name}（{staff.role}）你好。你和朋友都能改这里的全部内容。
          </p>
        </div>
        <div className="flex gap-2">
          <Link className="btn-3d" href="/home">
            回小窝
          </Link>
          <form action={logoutAction}>
            <button className="btn-3d" type="submit">
              登出
            </button>
          </form>
        </div>
      </div>
      <nav className="mb-3 flex flex-wrap gap-1">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="nav-tab">
            {label}
          </Link>
        ))}
      </nav>
      <div className="hompy-frame p-3">{children}</div>
    </div>
  );
}
