"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav({
  items,
}: {
  items: readonly (readonly [string, string])[];
}) {
  const pathname = usePathname();
  return (
    <nav className="menu-bar">
      {items.map(([href, label]) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={active ? "menu-link active" : "menu-link"}>
            » {label}
          </Link>
        );
      })}
      <span className="menu-link" aria-hidden="true">
        »
      </span>
    </nav>
  );
}
