import { PhotoUploader } from "@/components/admin/photo-uploader";
import { AlbumForm } from "@/components/dashboard/album-form";
import { deletePhotoAction, savePhotoCaptionAction } from "@/lib/actions";
import { getAlbum, getPhotos } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getAlbum(id);
  if (!album) notFound();
  const photos = (await getPhotos(true)).filter((photo) => photo.album_id === album.id);
  return (
    <div className="space-y-3">
      <p className="text-xs">
        <Link href="/dashboard/albums">« Album Manager</Link>
      </p>
      <AlbumForm album={album} photos={photos} />
      <PhotoUploader albumId={album.id} />
      {photos.map((photo) => (
        <article className="widget" key={photo.id}>
          <div className="widget-body flex gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.public_url} alt="" className="h-20 w-20 object-cover" />
            <form action={savePhotoCaptionAction} className="flex flex-1 gap-2">
              <input type="hidden" name="id" value={photo.id} />
              <input className="field" name="caption" defaultValue={photo.caption} />
              <button className="btn-3d" type="submit">
                说明
              </button>
            </form>
            <form action={deletePhotoAction.bind(null, photo.id)}>
              <button className="btn-3d" type="submit">
                删除
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
