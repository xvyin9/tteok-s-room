"use client";

import { applyThemeAction, saveAppearanceAction, uploadLocalFile } from "@/lib/actions";
import { themes } from "@/lib/themes";
import type { SiteSettings } from "@/types/database";
import { useState } from "react";

export function AppearanceForm({ settings }: { settings: SiteSettings }) {
  const [paths, setPaths] = useState({
    background_image: settings.background_image ?? "",
    banner_image: settings.banner_image ?? "",
    logo_url: settings.logo_url ?? "",
    sidebar_image: settings.sidebar_image ?? "",
  });
  const [status, setStatus] = useState<string | null>(null);

  async function upload(bucket: string, file: File, key: keyof typeof paths) {
    const body = new FormData();
    body.set("bucket", "appearance");
    body.set("file", file);
    const uploaded = await uploadLocalFile(body);
    if (!uploaded.publicUrl) {
      setStatus(uploaded.error ?? "上传失败");
      return;
    }
    setPaths((current) => ({ ...current, [key]: uploaded.publicUrl }));
    setStatus("图片已放好，记得按保存");
  }

  return (
    <div className="space-y-3">
      <form className="widget" action={applyThemeAction}>
        <div className="widget-title">一键换主题</div>
        <div className="widget-body flex flex-wrap gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className="btn-3d theme-card"
              name="theme"
              value={theme.id}
              type="submit"
            >
              <span className="theme-swatch" style={{ background: theme.background_color }} />
              <strong>{theme.name}</strong>
              <span className="block text-[11px]">{theme.blurb}</span>
            </button>
          ))}
        </div>
      </form>

      <form
        className="widget"
        action={async (formData) => {
          for (const [key, value] of Object.entries(paths)) formData.set(key, value);
          const result = await saveAppearanceAction(formData);
          setStatus(result.error ?? "装修已生效");
        }}
      >
        <div className="widget-title">自己装修</div>
        <div className="widget-body space-y-2">
          <label className="block text-xs">
            背景方式
            <select className="field mt-1" name="background_mode" defaultValue={settings.background_mode}>
              <option value="theme">跟随主题</option>
              <option value="color">纯色</option>
              <option value="image">图片</option>
            </select>
          </label>
          <Upload label="背景图片" onFile={(file) => upload("appearance", file, "background_image")} />
          <Preview src={paths.background_image} />
          <label className="block text-xs">
            背景颜色
            <input className="mt-1" type="color" name="background_color" defaultValue={settings.background_color} />
          </label>
          <label className="block text-xs">
            主色调
            <input className="mt-1" type="color" name="accent_color" defaultValue={settings.accent_color} />
          </label>
          <label className="block text-xs">
            文字颜色
            <input className="mt-1" type="color" name="ink_color" defaultValue={settings.ink_color} />
          </label>
          <label className="block text-xs">
            字体
            <select className="field mt-1" name="font_family" defaultValue={settings.font_family}>
              <option value="rounded">圆体</option>
              <option value="cute">可爱体</option>
              <option value="pixel">像素</option>
            </select>
          </label>
          <Upload label="首页 Banner" onFile={(file) => upload("appearance", file, "banner_image")} />
          <Preview src={paths.banner_image} />
          <Upload label="Logo" onFile={(file) => upload("appearance", file, "logo_url")} />
          <Preview src={paths.logo_url} />
          <Upload label="侧边栏图片" onFile={(file) => upload("appearance", file, "sidebar_image")} />
          <Preview src={paths.sidebar_image} />
          <label className="block text-xs">
            欢迎语
            <input className="field mt-1" name="welcome_text" defaultValue={settings.welcome_text} />
          </label>
          <label className="block text-xs">
            首页标题
            <input className="field mt-1" name="home_title" defaultValue={settings.home_title} placeholder="留空就用网站标题" />
          </label>
          <label className="block text-xs">
            导航 · 首页
            <input className="field mt-1" name="nav_home" defaultValue={settings.nav_home} />
          </label>
          <label className="block text-xs">
            导航 · 日记
            <input className="field mt-1" name="nav_diary" defaultValue={settings.nav_diary} />
          </label>
          <label className="block text-xs">
            导航 · 照片
            <input className="field mt-1" name="nav_photos" defaultValue={settings.nav_photos} />
          </label>
          <label className="block text-xs">
            导航 · 动态
            <input className="field mt-1" name="nav_notes" defaultValue={settings.nav_notes} />
          </label>
          <label className="block text-xs">
            导航 · 留言
            <input className="field mt-1" name="nav_guest" defaultValue={settings.nav_guest} />
          </label>
          <label className="text-xs">
            <input type="checkbox" name="show_decorations" defaultChecked={settings.show_decorations} /> 开启装饰元素
          </label>
          <div>
            <button className="btn-3d" type="submit">
              保存装修
            </button>
          </div>
          {status ? <p className="text-xs">{status}</p> : null}
        </div>
      </form>
    </div>
  );
}

function Upload({ label, onFile }: { label: string; onFile: (file: File) => void }) {
  return (
    <label className="block text-xs">
      {label}
      <input
        className="field mt-1"
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </label>
  );
}

function Preview({ src }: { src: string }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="max-h-24" />
  );
}
