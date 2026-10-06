import { PhotoLightbox } from "@/components/photos/photo-lightbox";
import { getPhotos } from "@/lib/queries";
import Link from "next/link";

export default async function PhotosPage() {
  const photos = await getPhotos();
  return (
    <div>
      <h2 className="site-title text-2xl">照片墙</h2>
      <p className="mb-3 text-xs">点开可以放大。像以前贴在桌面的拍立得。</p>
      {photos.length ? (
        <div className="photo-wall grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <div className="photo-tile" key={photo.id}>
              <PhotoLightbox src={photo.public_url} caption={photo.caption} />
              <Link href={`/photos/${photo.id}`} className="mt-1 block text-[11px]">
                {photo.caption || "没有说明"} · 单独打开
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>还没有照片。等主人上线贴图。</p>
      )}
    </div>
  );
}
