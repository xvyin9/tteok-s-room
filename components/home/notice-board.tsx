import type { SiteSettings } from "@/types/database";

const links: { label: string; key: keyof SiteSettings; color: string }[] = [
  { label: "Instagram", key: "instagram_url", color: "#ff5fa2" },
  { label: "X", key: "x_url", color: "#111111" },
  { label: "TikTok", key: "tiktok_url", color: "#25f4ee" },
  { label: "YouTube", key: "youtube_url", color: "#ff0033" },
];

export function NoticeBoard({ settings }: { settings: SiteSettings }) {
  const items = links.flatMap((item) => {
    const href = settings[item.key];
    if (typeof href !== "string" || !href) return [];
    return [{ label: item.label, href, color: item.color }];
  });

  if (!items.length) {
    return <p className="text-xs">链接还是空的。在首页「编辑小窝」里贴。</p>;
  }

  return (
    <ul className="space-y-1 text-xs font-bold">
      {items.map((item) => (
        <li key={item.label}>
          <a href={item.href} target="_blank" rel="noreferrer">
            <span
              className="mr-1 inline-block h-2 w-2 align-middle"
              style={{ background: item.color }}
            />
            {item.label} ★
          </a>
        </li>
      ))}
    </ul>
  );
}
