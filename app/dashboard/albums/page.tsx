import { AlbumForm } from "@/components/dashboard/album-form";
import { deleteAlbumAction } from "@/lib/actions";
import { getAlbums } from "@/lib/queries";
import Link from "next/link";

export default async function AlbumManagerPage() {
  const albums = await getAlbums();
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Album Manager</h2>
      <AlbumForm />
      {albums.map((album) => (
        <article className="widget" key={album.id}>
          <div className="widget-body flex items-center justify-between gap-3">
            {album.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={album.cover_url} alt="" className="h-16 w-16 object-cover" />
            ) : null}
            <div className="min-w-0 flex-1">
              <Link className="font-bold" href={`/dashboard/albums/${album.id}`}>
                {album.name}
              </Link>
              <p className="text-[11px]">
                {album.photo_count} 张 · 排序 {album.sort_order} ·{" "}
                {new Date(album.created_at).toLocaleString("zh-TW")}
              </p>
            </div>
            <form action={deleteAlbumAction.bind(null, album.id)}>
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
