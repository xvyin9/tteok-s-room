import { GuestbookList } from "@/components/guestbook/guestbook-list";
import { PhotoLightbox } from "@/components/photos/photo-lightbox";
import { getArticles, getGuestbook, getMoments, getPhotos, getSettings } from "@/lib/queries";
import Link from "next/link";

export default async function HomePage() {
  const [settings, photos, moments, articles, guestbook] = await Promise.all([
    getSettings(),
    getPhotos(),
    getMoments(),
    getArticles(),
    getGuestbook(),
  ]);

  return (
    <div>
      <h2 className="site-title text-2xl">欢迎来到 {settings.owner_display_name} 的房间</h2>
      <p className="mt-1 text-sm whitespace-pre-wrap">{settings.bio}</p>
      <hr className="dot" />

      <h3 className="widget-title mb-2">最新照片</h3>
      {photos.length ? (
        <div className="photo-wall grid grid-cols-3 gap-2">
          {photos.slice(0, 3).map((photo) => (
            <div className="photo-tile" key={photo.id}>
              <PhotoLightbox src={photo.public_url} caption={photo.caption} />
              <p className="mt-1 text-[11px]">{photo.caption}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm">照片墙还是空的。</p>
      )}
      <p className="mt-2 text-xs">
        <Link href="/photos">看更多照片 »</Link>
      </p>
      <hr className="dot" />

      <h3 className="widget-title mb-2">最近动态</h3>
      {moments[0] ? (
        <div>
          <p className="text-sm whitespace-pre-wrap">{moments[0].body || "（贴了一张图）"}</p>
          {moments[0].images[0] ? (
            <div className="photo-tile mt-2 max-w-xs">
              <PhotoLightbox
                src={moments[0].images[0].public_url}
                caption={moments[0].body}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm">还没有动态。</p>
      )}
      <p className="mt-2 text-xs">
        <Link href="/moments">全部动态 »</Link>
      </p>
      <hr className="dot" />

      <h3 className="widget-title mb-2">最新文章</h3>
      {articles[0] ? (
        <Link href={`/articles/${articles[0].slug}`}>{articles[0].title}</Link>
      ) : (
        <p className="text-sm">日记本还是空白。</p>
      )}
      <hr className="dot" />

      <h3 className="widget-title mb-2">最新留言</h3>
      <GuestbookList messages={guestbook.slice(0, 3)} />
      <p className="text-xs">
        <Link href="/guestbook">去留言板 »</Link>
      </p>
    </div>
  );
}
