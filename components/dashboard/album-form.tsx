"use client";

import { DateFields } from "@/components/edit/date-fields";
import { saveAlbumAction } from "@/lib/actions";
import type { Album, Photo } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AlbumForm({ album, photos = [] }: { album?: Album; photos?: Photo[] }) {
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  return (
    <form
      className="widget"
      action={async (formData) => {
        if (album) formData.set("id", album.id);
        const result = await saveAlbumAction(formData);
        setStatus(result.error ?? "相册存好了");
        if (!result.error) router.refresh();
      }}
    >
      <div className="widget-title">{album ? "编辑相册" : "新相册"}</div>
      <div className="widget-body space-y-2">
        <label className="block text-xs">
          名称
          <input className="field mt-1" name="name" defaultValue={album?.name ?? ""} required />
        </label>
        <label className="block text-xs">
          简介
          <textarea className="field mt-1 h-24" name="description" defaultValue={album?.description ?? ""} />
        </label>
        <label className="block text-xs">
          排序（数字小的排前面）
          <input className="field mt-1" name="sort_order" type="number" defaultValue={album?.sort_order ?? 0} />
        </label>
        <DateFields value={album?.created_at} label="创建日期和时间" />
        {album ? (
          <label className="block text-xs">
            封面
            <select className="field mt-1" name="cover_photo_id" defaultValue={album.cover_photo_id ?? ""}>
              <option value="">用第一张照片</option>
              {photos.map((photo) => (
                <option key={photo.id} value={photo.id}>
                  {photo.caption || "未命名照片"}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button className="btn-3d" type="submit">
          保存相册
        </button>
        {status ? <p className="text-xs">{status}</p> : null}
      </div>
    </form>
  );
}
