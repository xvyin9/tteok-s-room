import { getAlbums } from "@/lib/queries";
import Link from "next/link";

function stamp(value: string) {
  return new Date(value).toLocaleDateString("zh-TW");
}

export default async function PhotosPage() {
  const albums = await getAlbums();
  return (
    <div>
      <h2 className="site-title text-2xl">相册</h2>
      <p className="mb-3 text-xs">一本一本慢慢翻。</p>
      {albums.length ? (
        <div className="album-grid">
          {albums.map((album) => (
            <Link className="album-card" href={`/photos/albums/${album.id}`} key={album.id}>
              {album.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="album-cover" src={album.cover_url} alt="" />
              ) : (
                <div className="album-cover album-empty">还没有封面</div>
              )}
              <strong>{album.name}</strong>
              <span>
                {album.photo_count} 张 · {stamp(album.created_at)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p>还没有相册。</p>
      )}
    </div>
  );
}
