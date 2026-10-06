"use client";

import { DateFields } from "@/components/edit/date-fields";
import { saveMomentAction } from "@/lib/actions";
import { STORAGE_BUCKETS } from "@/lib/config";
import { uploadToBucket } from "@/lib/upload";
import type { MomentPost } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MomentEditor({ moment }: { moment?: MomentPost }) {
  const [images, setImages] = useState(moment?.images.map((image) => image.public_url) ?? []);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  return (
    <form
      className="widget"
      action={async (formData) => {
        formData.set("images", images.join("\n"));
        if (moment) formData.set("id", moment.id);
        const result = await saveMomentAction(formData);
        setStatus(result.error ?? "日记存好了");
        if (!result.error) router.refresh();
      }}
    >
      <div className="widget-title">{moment ? "编辑动态" : "新动态"}</div>
      <div className="widget-body space-y-2">
        <label className="block text-xs">
          标题
          <input className="field mt-1" name="title" defaultValue={moment?.title ?? ""} required />
        </label>
        <label className="block text-xs">
          简介
          <input className="field mt-1" name="summary" defaultValue={moment?.summary ?? ""} />
        </label>
        <label className="block text-xs">
          正文
          <textarea className="field mt-1 h-40" name="body" defaultValue={moment?.body ?? ""} />
        </label>
        <DateFields value={moment?.published_at} label="发布日期和时间" />
        <label className="block text-xs">
          照片（可以多张）
          <input
            className="field mt-1"
            type="file"
            accept="image/*"
            multiple
            onChange={async (event) => {
              const files = Array.from(event.target.files ?? []);
              for (const file of files) {
                const uploaded = await uploadToBucket(STORAGE_BUCKETS.momentImages, file);
                setImages((current) => [...current, uploaded.publicUrl]);
              }
              event.target.value = "";
            }}
          />
        </label>
        <div className="grid grid-cols-3 gap-2">
          {images.map((src) => (
            <div key={src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-20 w-full object-cover" />
              <button
                className="btn-3d mt-1"
                type="button"
                onClick={() => setImages((current) => current.filter((item) => item !== src))}
              >
                拿掉
              </button>
            </div>
          ))}
        </div>
        <button className="btn-3d" type="submit">
          保存动态
        </button>
        {status ? <p className="text-xs">{status}</p> : null}
      </div>
    </form>
  );
}
