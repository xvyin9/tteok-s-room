import { getAlbums, getArticles, getGuestbook, getMoments, getSettings, getTracks } from "@/lib/queries";
import Link from "next/link";

export default async function DashboardPage() {
  const [settings, albums, moments, articles, tracks, guestbook] = await Promise.all([
    getSettings(),
    getAlbums(),
    getMoments(true),
    getArticles(true),
    getTracks(true),
    getGuestbook(true),
  ]);
  const cards = [
    ["/dashboard/profile", "Profile", settings.owner_display_name],
    ["/dashboard/albums", "Album Manager", `${albums.length} 本相册`],
    ["/dashboard/moments", "Moment Manager", `${moments.length} 篇日记`],
    ["/dashboard/articles", "Articles", `${articles.length} 篇文章`],
    ["/dashboard/music", "Music", `${tracks.length} 首歌`],
    ["/dashboard/messages", "Message Board", `${guestbook.length} 条留言`],
    ["/dashboard/appearance", "Appearance", settings.theme],
  ] as const;

  return (
    <div className="dash-grid sm:grid-cols-2">
      {cards.map(([href, title, detail]) => (
        <Link key={href} href={href} className="widget">
          <div className="widget-title">{title}</div>
          <div className="widget-body">{detail}</div>
        </Link>
      ))}
    </div>
  );
}
