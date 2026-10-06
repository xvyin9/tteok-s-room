"use client";

import { saveSettingsAction, uploadLocalFile } from "@/lib/actions";
import type { SiteSettings } from "@/types/database";
import { useState } from "react";

export function ProfileForm({ settings }: { settings: SiteSettings }) {
  const [avatarUrl, setAvatarUrl] = useState(settings.avatar_url ?? "");
  const [status, setStatus] = useState<string | null>(null);

  return (
    <form
      className="widget"
      action={async (formData) => {
        formData.set("avatar_url", avatarUrl);
        const result = await saveSettingsAction(formData);
        setStatus(result.error ?? "已保存");
      }}
    >
      <div className="widget-title">个人资料</div>
      <div className="widget-body space-y-2">
        <label className="block text-xs">
          头像
          <input
            className="field mt-1"
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const body = new FormData();
              body.set("bucket", "avatars");
              body.set("file", file);
              const uploaded = await uploadLocalFile(body);
              if (uploaded.publicUrl) setAvatarUrl(uploaded.publicUrl);
              else setStatus(uploaded.error ?? "上传失败");
            }}
          />
        </label>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="room-logo" />
        ) : null}
        <Field name="owner_display_name" label="昵称" defaultValue={settings.owner_display_name} />
        <Field name="site_title" label="网站标题" defaultValue={settings.site_title} />
        <Field name="bio" label="简介" defaultValue={settings.bio} multiline />
        <Field name="mood" label="心情" defaultValue={settings.mood} />
        <Field name="listening" label="在听" defaultValue={settings.listening} />
        <Field name="eating" label="在吃" defaultValue={settings.eating} />
        <Field name="weather" label="天气" defaultValue={settings.weather} />
        <Field name="location" label="地点" defaultValue={settings.location} />
        <Field name="doing" label="在做" defaultValue={settings.doing} />
        <Field name="sticker" label="贴纸" defaultValue={settings.sticker} />
        <Field name="useless_note" label="无用信息" defaultValue={settings.useless_note} multiline />
        <Field name="current_password" label="现在的密码（改密码时才填）" type="password" />
        <Field name="next_password" label="新密码" type="password" />
        <button className="btn-3d" type="submit">
          保存资料
        </button>
        {status ? <p className="text-xs">{status}</p> : null}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue = "",
  multiline = false,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-xs">
      {label}
      {multiline ? (
        <textarea className="field mt-1 h-24" name={name} defaultValue={defaultValue} />
      ) : (
        <input className="field mt-1" name={name} type={type} defaultValue={defaultValue} />
      )}
    </label>
  );
}
