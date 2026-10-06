import { logoutAction } from "@/lib/actions";
import { isOwner } from "@/lib/owner";
import Link from "next/link";
import { redirect } from "next/navigation";

const links = [
  ["/dashboard", "总览"],
  ["/dashboard/profile", "Profile"],
  ["/dashboard/albums", "Album Manager"],
  ["/dashboard/moments", "Moment Manager"],
  ["/dashboard/articles", "Articles"],
  ["/dashboard/music", "Music"],
  ["/dashboard/social", "Social Links"],
  ["/dashboard/messages", "Message Board"],
  ["/dashboard/appearance", "Appearance"],
] as const;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isOwner())) redirect("/login");
  return (
    <div className="dash">
      <p className="mb-2 text-xs">
        <Link href="/home">« 查看网站</Link>
      </p>
      <h1 className="site-title mb-2 text-3xl">tteok 的后台</h1>
      <nav className="dash-nav">
        {links.map(([href, label]) => (
          <Link key={href} className="btn-3d" href={href}>
            {label}
          </Link>
        ))}
        <form action={logoutAction}>
          <button className="btn-3d" type="submit">
            退出
          </button>
        </form>
      </nav>
      {children}
    </div>
  );
}
