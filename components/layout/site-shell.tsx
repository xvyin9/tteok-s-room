import { NoticeBoard } from "@/components/home/notice-board";
import { SiteNav } from "@/components/layout/site-nav";
import { MiniPlayer } from "@/components/player/mini-player";
import { AvatarFrame } from "@/components/skin/avatar-frame";
import { HitCounter } from "@/components/skin/hit-counter";
import { Miniroom } from "@/components/skin/miniroom";
import type { SiteSettings } from "@/types/database";
import Link from "next/link";

export function SiteShell({
  settings,
  children,
  right,
  demo = false,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
  right?: React.ReactNode;
  demo?: boolean;
}) {
  return (
    <div className="mx-auto max-w-5xl px-2 py-3">
      <header className="hompy-frame mb-3 p-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="pixel text-[10px] text-pink-700">CYWORLD / QZONE / FC2</p>
            <h1 className="site-title text-3xl md:text-4xl">{settings.site_title}</h1>
            <p className="text-xs">心情：{settings.mood}</p>
          </div>
          <Link href="/" className="btn-3d">
            离开小窝
          </Link>
        </div>
        <div className="marquee-bar mt-2 overflow-hidden">
          <p className="marquee-inner">
            欢迎光临 {settings.site_title} ★ 请把音响打开 ★ 留言请温柔 ★ 2008 forever ★
          </p>
        </div>
      </header>

      <SiteNav />

      {demo ? (
        <p className="setup-ribbon">
          现在是示范小窝。接上 Supabase 之后，照片、动态、文章和留言会换成你们自己的。
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)_200px]">
        <aside>
          <section className="widget">
            <div className="widget-title">★ PROFILE</div>
            <div className="widget-body text-center">
              <AvatarFrame
                src={settings.avatar_url}
                name={settings.owner_display_name}
              />
              <h2 className="site-title mt-2 text-xl">{settings.owner_display_name}</h2>
              <p className="mt-2 text-left text-xs whitespace-pre-wrap">{settings.bio}</p>
            </div>
          </section>
          <section className="widget">
            <div className="widget-title">♪ BGM</div>
            <MiniPlayer />
          </section>
          <section className="widget">
            <div className="widget-title">公告栏 NOTICE</div>
            <div className="widget-body">
              <NoticeBoard settings={settings} />
            </div>
          </section>
          <section className="widget">
            <div className="widget-title">COUNTER</div>
            <div className="widget-body">
              <HitCounter today={settings.today_count} total={settings.hit_count} />
            </div>
          </section>
        </aside>

        <main className="hompy-frame min-h-[480px] p-3">{children}</main>

        <aside className="hidden md:block">
          {right ?? (
            <>
              <section className="widget">
                <div className="widget-title">迷你房间</div>
                <div className="widget-body">
                  <Miniroom />
                  <p className="mt-1 text-[11px]">Cyworld 式的小房间。人还没搬进来。</p>
                </div>
              </section>
              <section className="widget">
                <div className="widget-title">小窝规矩</div>
                <div className="widget-body text-xs">
                  <p>1. 随便看</p>
                  <p>2. 请留言</p>
                  <p>3. 照片可以点开</p>
                  <p>4. 管理员在后厨</p>
                </div>
              </section>
            </>
          )}
        </aside>
      </div>

      <footer className="mt-3 border-2 border-dashed border-pink-300 bg-white/70 p-2 text-center text-[11px]">
        <p>{settings.site_title} since 2008.05.20 ※ best viewed with sparkle</p>
        <p>
          <Link href="/login">管理室入口</Link>
        </p>
      </footer>
    </div>
  );
}
