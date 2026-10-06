"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/home", "小窝"],
  ["/photos", "照片墙"],
  ["/moments", "动态"],
  ["/articles", "文章"],
  ["/guestbook", "留言板"],
] as const;

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-3 flex flex-wrap gap-1">
      {items.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={`nav-tab ${pathname === href || pathname.startsWith(`${href}/`) ? "active" : ""}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
