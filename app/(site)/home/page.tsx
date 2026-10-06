import { GuestbookList } from "@/components/guestbook/guestbook-list";
import { PhotoLightbox } from "@/components/photos/photo-lightbox";
import { getAlbums, getArticles, getGuestbook, getMoments, getSettings, getTracks } from "@/lib/queries";
import Link from "next/link";

function stamp(value: string) {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hour}:${minute}`;
}

export default async function HomePage() {
  const [settings, albums, moments, articles, guestbook, tracks] = await Promise.all([
    getSettings(),
    getAlbums(),
    getMoments(),
    getArticles(),
    getGuestbook(),
    getTracks(),
  ]);

  return (
    <div>
      <div className="blog-columns">
        <section className="panel">
          <h3 className="panel-title">最新日记</h3>
          <div className="panel-body diary-copy">
            <p className="whitespace-pre-wrap">{settings.bio}</p>
            {articles[0] ? (
              <p>
                <Link href={`/articles/${articles[0].slug}`}>{articles[0].title}</Link>
                <span className="stamp">{stamp(articles[0].published_at ?? articles[0].created_at)}</span>
              </p>
            ) : null}
            <p>
              <Link href="/articles">Diary Archive »</Link>
            </p>
          </div>
        </section>

        <section className="panel">
          <h3 className="panel-title">最新动态</h3>
          <div className="panel-body">
            {moments.slice(0, 3).map((moment) => (
              <article className="mini-card" key={moment.id}>
                <div className="mini-card-top">
                  <strong>
                    <Link href={`/moments/${moment.id}`}>{moment.title}</Link>
                  </strong>
                  <span>{stamp(moment.published_at)}</span>
                </div>
                <p>{moment.summary}</p>
                {moment.images[0] ? (
                  <PhotoLightbox
                    src={moment.images[0].public_url}
                    caption={moment.title}
                    thumbClassName="mini-thumb"
                  />
                ) : null}
              </article>
            ))}
            <p>
              <Link href="/moments">全部动态 »</Link>
            </p>
          </div>
        </section>

        <section className="panel">
          <h3 className="panel-title">相册</h3>
          <div className="panel-body">
            {albums.slice(0, 3).map((album) => (
              <article className="mini-card" key={album.id}>
                <Link href={`/photos/albums/${album.id}`}>
                  {album.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="mini-thumb" src={album.cover_url} alt="" />
                  ) : null}
                  <strong>{album.name}</strong>
                </Link>
                <p>
                  <span className="stamp">
                    {album.photo_count} 张 · {stamp(album.created_at)}
                  </span>
                </p>
              </article>
            ))}
            <p>
              <Link href="/photos">Photo Library »</Link>
            </p>
          </div>
        </section>
      </div>

      <section className="panel guest-panel">
        <h3 className="panel-title">BGM</h3>
        <div className="panel-body text-xs">
          {tracks.length ? (
            <ul>
              {tracks.map((track) => (
                <li key={track.id}>{track.title}</li>
              ))}
            </ul>
          ) : (
            <p>播放列表还是空的。</p>
          )}
        </div>
      </section>
      <section className="panel guest-panel">
        <h3 className="panel-title">留言板 Guest Book</h3>
        <div className="panel-body">
          <GuestbookList messages={guestbook.slice(0, 2)} />
          <p>
            <Link href="/guestbook">去留言板 »</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
