import { SiteNav } from "@/components/layout/site-nav";
import { MiniPlayer } from "@/components/player/mini-player";
import { BannerCharms, SideCharms, YellowDancer } from "@/components/skin/charms";
import { HitCounter } from "@/components/skin/hit-counter";
import type { SiteSettings } from "@/types/database";
import Link from "next/link";

export function SiteShell({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
  right?: React.ReactNode;
  demo?: boolean;
}) {
  const updated = settings.updated_at.slice(2, 10).replaceAll("-", ".");
  const title = settings.home_title || settings.site_title;
  const nav = [
    ["/home", settings.nav_home],
    ["/articles", settings.nav_diary],
    ["/photos", settings.nav_photos],
    ["/moments", settings.nav_notes],
    ["/guestbook", settings.nav_guest],
  ] as const;
  const sideLinks = [
    ["/home", "Home"],
    ["/articles", "Diary Archive"],
    ["/photos", "Photo Library"],
    ["/moments", "Little Notes"],
    ["/guestbook", "Guest Book"],
  ] as const;
  const links = [
    ["Instagram", settings.instagram_url],
    ["X", settings.x_url],
    ["TikTok", settings.tiktok_url],
    ["YouTube", settings.youtube_url],
    ...settings.other_socials.map((item) => [item.label, item.url] as const),
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <div className="sky-page">
      <aside className="side-col">
        {settings.show_decorations ? <YellowDancer /> : null}
        {settings.sidebar_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="sidebar-photo" src={settings.sidebar_image} alt="" />
        ) : null}
        <section className="side-box">
          <h2>SITE INFO</h2>
          <nav className="side-links">
            {sideLinks.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <HitCounter today={settings.today_count} total={settings.hit_count} />
          <p className="side-meta">
            last update : {updated}
            <br />
            total visits : {String(settings.hit_count).padStart(4, "0")}
            <br />★ best viewed with sparkles
          </p>
        </section>
        <section className="side-box">
          <h2>LINKS</h2>
          <div className="side-body">
            {links.map(([label, url]) => (
              <p key={label}>
                <a href={url} target="_blank" rel="noreferrer">
                  {label}
                </a>
              </p>
            ))}
          </div>
        </section>
      </aside>

      <div className="blog-frame">
        <header
          className={settings.banner_image ? "banner has-banner" : "banner"}
          style={settings.banner_image ? { backgroundImage: `url("${settings.banner_image}")` } : undefined}
        >
          <div className="banner-copy">
            {settings.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="room-logo" src={settings.logo_url} alt="" />
            ) : null}
            <p className="welcome-pill">{settings.welcome_text}</p>
            <h1 className="banner-title">{title}</h1>
            <p className="banner-sub">{settings.owner_display_name}</p>
            <p className="banner-mood">{settings.mood}</p>
          </div>
          {settings.show_decorations ? <BannerCharms /> : null}
        </header>

        <SiteNav items={nav} />
        <div className="blog-body">{children}</div>

        <div className="blog-dock">
          <MiniPlayer />
          <section className="win-note">
            <div className="win-title">memory.txt — 简介</div>
            <p className="win-sign whitespace-pre-wrap">{settings.bio}</p>
            <p className="win-sign">
              <Link href="/">离开小窝</Link>
              {" · "}
              <Link href="/login">tteok 入口</Link>
            </p>
          </section>
        </div>
      </div>

      <aside className="side-col">
        {settings.show_decorations ? <p className="click-me blink">click me ~ about this room</p> : null}
        <section className="side-box">
          <h2>CURRENT STATUS</h2>
          <ul className="status-list">
            <li>
              <span>mood</span> {settings.mood}
            </li>
            <li>
              <span>listening</span> {settings.listening}
            </li>
            <li>
              <span>eating</span> {settings.eating}
            </li>
            <li>
              <span>weather</span> {settings.weather}
            </li>
            <li>
              <span>location</span> {settings.location}
            </li>
            <li>
              <span>doing</span> {settings.doing}
            </li>
          </ul>
        </section>
        <section className="side-box">
          <h2>USELESS INFO</h2>
          <div className="side-body whitespace-pre-wrap">{settings.useless_note}</div>
        </section>
        {settings.show_decorations ? <SideCharms /> : null}
        {settings.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="sidebar-photo" src={settings.avatar_url} alt="" />
        ) : null}
        <p className="sticker-field">{settings.sticker}</p>
      </aside>
    </div>
  );
}
