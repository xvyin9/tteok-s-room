import Link from "next/link";

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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
      </nav>
      {children}
    </div>
  );
}
