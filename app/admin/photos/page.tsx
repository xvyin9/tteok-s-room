import { PhotoUploader } from "@/components/admin/photo-uploader";
import { deletePhotoAction, togglePhotoHiddenAction } from "@/lib/actions";
import { getPhotos } from "@/lib/queries";

export default async function PhotosAdminPage() {
  const photos = await getPhotos(true);
  return (
    <div>
      <h2 className="site-title mb-3 text-xl">照片墙管理</h2>
      <PhotoUploader />
      <table className="admin-table mt-3">
        <thead>
          <tr>
            <th>预览</th>
            <th>说明</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {photos.map((photo) => (
            <tr key={photo.id}>
              <td>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.public_url} alt="" className="h-16 w-16 object-cover" />
                {photo.is_hidden ? <div className="text-[11px]">已隐藏</div> : null}
              </td>
              <td>{photo.caption}</td>
              <td>
                <form
                  action={async () => {
                    await togglePhotoHiddenAction(photo.id, !photo.is_hidden);
                  }}
                >
                  <button className="btn-3d" type="submit">
                    {photo.is_hidden ? "显示" : "隐藏"}
                  </button>
                </form>
                <form
                  className="mt-1"
                  action={async () => {
                    await deletePhotoAction(photo.id, photo.storage_path);
                  }}
                >
                  <button className="btn-3d" type="submit">
                    删除
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
