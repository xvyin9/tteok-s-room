import { PhotoLightbox } from "@/components/photos/photo-lightbox";
import { getAlbum, getPhotos } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getAlbum(id);
  if (!album) notFound();
  const photos = (await getPhotos()).filter((photo) => photo.album_id === album.id);
  return (
    <div>
      <p className="mb-2 text-xs">
        <Link href="/photos">« 回相册</Link>
      </p>
      <h2 className="site-title text-3xl">{album.name}</h2>
      <p className="mb-2 text-[11px]">{new Date(album.created_at).toLocaleString("zh-TW")}</p>
      {album.description ? <p className="mb-3 whitespace-pre-wrap text-sm">{album.description}</p> : null}
      {photos.length ? (
        <div className="photo-masonry">
          {photos.map((photo) => (
            <div className="photo-tile" key={photo.id}>
              <PhotoLightbox src={photo.public_url} caption={photo.caption} />
              {photo.caption ? <p className="mt-1 text-xs">{photo.caption}</p> : null}
            </div>
          ))}
        </div>
      ) : (
        <p>这本相册还是空的。</p>
      )}
    </div>
  );
}
