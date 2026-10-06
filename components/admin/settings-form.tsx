"use client";

import { saveSettingsAction } from "@/lib/actions";
import { STORAGE_BUCKETS } from "@/lib/config";
import { uploadToBucket } from "@/lib/upload";
import type { SiteSettings } from "@/types/database";
import { useState } from "react";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [avatarUrl, setAvatarUrl] = useState(settings.avatar_url ?? "");
  const [status, setStatus] = useState<string | null>(null);

  return (
    <form
      className="space-y-2"
      action={async (formData) => {
        formData.set("avatar_url", avatarUrl);
        const result = await saveSettingsAction(formData);
        setStatus(result.error ?? "保存好了");
      }}
    >
      <label className="block text-xs">
        站点名
        <input className="field mt-1" name="site_title" defaultValue={settings.site_title} />
      </label>
      <label className="block text-xs">
        名字
        <input
          className="field mt-1"
          name="owner_display_name"
          defaultValue={settings.owner_display_name}
        />
      </label>
      <label className="block text-xs">
        心情
        <input className="field mt-1" name="mood" defaultValue={settings.mood} />
      </label>
      <label className="block text-xs">
        简介
        <textarea className="field mt-1 h-24" name="bio" defaultValue={settings.bio} />
      </label>
      <label className="block text-xs">
        头像
        <input
          className="field mt-1"
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const uploaded = await uploadToBucket(STORAGE_BUCKETS.avatars, file);
            setAvatarUrl(uploaded.publicUrl);
          }}
        />
      </label>
      <input type="hidden" name="avatar_url" value={avatarUrl} />
      <label className="block text-xs">
        Instagram
        <input className="field mt-1" name="instagram_url" defaultValue={settings.instagram_url ?? ""} />
      </label>
      <label className="block text-xs">
        X
        <input className="field mt-1" name="x_url" defaultValue={settings.x_url ?? ""} />
      </label>
      <label className="block text-xs">
        TikTok
        <input className="field mt-1" name="tiktok_url" defaultValue={settings.tiktok_url ?? ""} />
      </label>
      <label className="block text-xs">
        YouTube
        <input className="field mt-1" name="youtube_url" defaultValue={settings.youtube_url ?? ""} />
      </label>
      <button className="btn-3d" type="submit">
        保存小窝资料
      </button>
      {status ? <p className="text-xs">{status}</p> : null}
    </form>
  );
}
