"use server";

import {
  bumpHits,
  checkPassword,
  deleteAlbum,
  deleteArticle,
  deleteComment,
  deleteExtraSocial,
  deleteMoment,
  deletePhoto,
  deleteTrack,
  hideComment,
  insertAlbum,
  insertArticle,
  insertComment,
  insertExtraSocial,
  insertMoment,
  insertPhoto,
  insertTrack,
  articleById,
  momentById,
  patchSettings,
  readSettings,
  setPassword,
  updateAlbum,
  updateArticle,
  updateArticleText as writeArticleText,
  updateComment,
  updateMoment,
  updatePhoto,
  updateTrack,
} from "@/lib/db";
import { clearOwnerCookie, isOwner, setOwnerCookie } from "@/lib/owner";
import { readDate } from "@/lib/dates";
import { themeById } from "@/lib/themes";
import type { MomentImage } from "@/types/database";
import { randomUUID } from "crypto";
import { mkdirSync, writeFileSync } from "fs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";

const uploadBuckets = new Set(["avatars", "photos", "moment-images", "article-covers", "appearance"]);

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/home");
  revalidatePath("/photos");
  revalidatePath("/moments");
  revalidatePath("/articles");
  revalidatePath("/guestbook");
  revalidatePath("/dashboard");
}

async function ownerOnly() {
  if (await isOwner()) return null;
  return { error: "只有 tteok 可以改这里" };
}

export async function incrementHits() {
  const counts = bumpHits();
  revalidateSite();
  return counts;
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "密码不对" };
  await setOwnerCookie();
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearOwnerCookie();
  redirect("/");
}

export async function uploadLocalFile(
  formData: FormData,
): Promise<{ error?: string; path?: string; publicUrl?: string }> {
  const denied = await ownerOnly();
  if (denied) return denied;
  const bucket = String(formData.get("bucket") ?? "");
  const file = formData.get("file");
  if (!uploadBuckets.has(bucket)) return { error: "这个位置不能上传" };
  if (!(file instanceof File) || file.size === 0) return { error: "请选一张图" };
  const safe = file.name.replace(/[^\w.\-]+/g, "_") || "image";
  const filename = `${Date.now()}-${safe}`;
  const dir = path.join(process.cwd(), "public", "uploads", bucket);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  const publicUrl = `/uploads/${bucket}/${filename}`;
  return { path: publicUrl, publicUrl, error: undefined };
}

export async function saveSettingsAction(formData: FormData) {
  const denied = await ownerOnly();
  if (denied) return denied;
  patchSettings({
    site_title: String(formData.get("site_title") ?? "").trim() || "tteok's Memory Room",
    owner_display_name: String(formData.get("owner_display_name") ?? "").trim() || "tteok",
    bio: String(formData.get("bio") ?? ""),
    mood: String(formData.get("mood") ?? ""),
    listening: String(formData.get("listening") ?? ""),
    eating: String(formData.get("eating") ?? ""),
    weather: String(formData.get("weather") ?? ""),
    location: String(formData.get("location") ?? ""),
    doing: String(formData.get("doing") ?? ""),
    sticker: String(formData.get("sticker") ?? ""),
    useless_note: String(formData.get("useless_note") ?? ""),
    avatar_url: emptyToNull(formData.get("avatar_url")),
    instagram_url: emptyToNull(formData.get("instagram_url")),
    x_url: emptyToNull(formData.get("x_url")),
    tiktok_url: emptyToNull(formData.get("tiktok_url")),
    youtube_url: emptyToNull(formData.get("youtube_url")),
  });
  const nextPassword = String(formData.get("next_password") ?? "");
  const currentPassword = String(formData.get("current_password") ?? "");
  if (nextPassword) {
    if (nextPassword.length < 4) return { error: "新密码至少 4 位" };
    if (!checkPassword(currentPassword)) return { error: "现在的密码不对，其他资料已经保存" };
    setPassword(nextPassword);
  }
  revalidateSite();
  return { error: undefined };
}

export async function saveSocialsAction(formData: FormData): Promise<void> {
  if (!(await isOwner())) return;
  patchSettings({
    instagram_url: emptyToNull(formData.get("instagram_url")),
    x_url: emptyToNull(formData.get("x_url")),
    tiktok_url: emptyToNull(formData.get("tiktok_url")),
    youtube_url: emptyToNull(formData.get("youtube_url")),
  });
  const label = String(formData.get("extra_label") ?? "").trim();
  const url = String(formData.get("extra_url") ?? "").trim();
  if (label && url) insertExtraSocial(label, url);
  revalidateSite();
}

export async function deleteExtraSocialAction(id: string) {
  if (!(await isOwner())) return;
  deleteExtraSocial(id);
  revalidateSite();
}

export async function saveAppearanceAction(formData: FormData) {
  const denied = await ownerOnly();
  if (denied) return denied;
  const mode = String(formData.get("background_mode") ?? "theme");
  patchSettings({
    background_mode: mode === "color" || mode === "image" ? mode : "theme",
    background_color: colorOr(formData.get("background_color"), "#8fd8ff"),
    accent_color: colorOr(formData.get("accent_color"), "#ff4f9a"),
    ink_color: colorOr(formData.get("ink_color"), "#4a2040"),
    font_family: fontOr(formData.get("font_family")),
    background_image: emptyToNull(formData.get("background_image")),
    banner_image: emptyToNull(formData.get("banner_image")),
    logo_url: emptyToNull(formData.get("logo_url")),
    sidebar_image: emptyToNull(formData.get("sidebar_image")),
    welcome_text: String(formData.get("welcome_text") ?? ""),
    home_title: String(formData.get("home_title") ?? ""),
    nav_home: String(formData.get("nav_home") ?? "").trim() || "HOME",
    nav_diary: String(formData.get("nav_diary") ?? "").trim() || "DIARY",
    nav_photos: String(formData.get("nav_photos") ?? "").trim() || "PHOTOS",
    nav_notes: String(formData.get("nav_notes") ?? "").trim() || "NOTES",
    nav_guest: String(formData.get("nav_guest") ?? "").trim() || "GUEST",
    show_decorations: formData.get("show_decorations") === "on",
  });
  revalidateSite();
  return { error: undefined };
}

export async function applyThemeAction(formData: FormData) {
  if (!(await isOwner())) return;
  const preset = themeById(String(formData.get("theme") ?? ""));
  patchSettings({
    theme: preset.id,
    background_mode: "theme",
    background_color: preset.background_color,
    accent_color: preset.accent_color,
    ink_color: preset.ink_color,
    font_family: preset.font_family,
    show_decorations: preset.show_decorations,
  });
  revalidateSite();
}

export async function saveAlbumAction(formData: FormData) {
  const denied = await ownerOnly();
  if (denied) return denied;
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const cover = String(formData.get("cover_photo_id") ?? "");
  const createdAt = readDate(formData);
  if (!name) return { error: "相册要有名字" };
  if (!createdAt) return { error: "请选一个有效的日期和时间" };
  if (id) {
    updateAlbum(id, {
      name,
      description,
      createdAt,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      coverPhotoId: cover || null,
    });
  } else {
    insertAlbum({ name, description, createdAt, sortOrder: Number.isFinite(sortOrder) ? sortOrder : undefined });
  }
  revalidateSite();
  return { error: undefined };
}

export async function createAlbumAction(formData: FormData) {
  return saveAlbumAction(formData);
}

export async function renameAlbumAction(formData: FormData) {
  return saveAlbumAction(formData);
}

export async function deleteAlbumAction(id: string) {
  if (!(await isOwner())) return;
  deleteAlbum(id);
  revalidateSite();
}

export async function createPhotoAction(storagePath: string, caption: string, albumId?: string | null) {
  const denied = await ownerOnly();
  if (denied) return denied;
  insertPhoto(storagePath, caption, albumId || null);
  revalidateSite();
  return { error: undefined };
}

export async function savePhotoCaptionAction(formData: FormData) {
  if (!(await isOwner())) return;
  updatePhoto(String(formData.get("id") ?? ""), { caption: String(formData.get("caption") ?? "") });
  revalidateSite();
}

export async function assignAlbumAction(formData: FormData) {
  if (!(await isOwner())) return;
  const album = String(formData.get("album_id") ?? "");
  updatePhoto(String(formData.get("id") ?? ""), { album_id: album || null });
  revalidateSite();
}

export async function togglePhotoHiddenAction(id: string, isHidden: boolean) {
  const denied = await ownerOnly();
  if (denied) return denied;
  updatePhoto(id, { is_hidden: isHidden });
  revalidateSite();
  return { error: undefined };
}

export async function deletePhotoAction(id: string) {
  if (!(await isOwner())) return;
  deletePhoto(id);
  revalidateSite();
}

export async function createMomentAction(body: string, imagePaths: string[]) {
  const denied = await ownerOnly();
  if (denied) return denied;
  const id = randomUUID();
  const images = imagePaths.map((storagePath, sortOrder) => imageFromPath(id, storagePath, sortOrder));
  const title = body.trim().slice(0, 24) || "未命名";
  insertMoment({
    id,
    title,
    summary: body.trim().slice(0, 80),
    body,
    publishedAt: new Date().toISOString(),
    images,
  });
  revalidateSite();
  return { error: undefined };
}

export async function saveMomentAction(formData: FormData) {
  const denied = await ownerOnly();
  if (denied) return denied;
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const publishedAt = readDate(formData);
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!title) return { error: "要写标题" };
  if (!publishedAt) return { error: "请选一个有效的日期和时间" };
  const momentId = id || randomUUID();
  const mapped = images.map((storagePath, sortOrder) => imageFromPath(momentId, storagePath, sortOrder));
  if (id) {
    if (!momentById(id)) return { error: "找不到这条动态" };
    updateMoment(id, { title, summary, body, publishedAt, images: mapped });
  } else {
    insertMoment({ id: momentId, title, summary, body, publishedAt, images: mapped });
  }
  revalidateSite();
  return { error: undefined };
}

export async function toggleMomentHiddenAction(id: string, isHidden: boolean) {
  const denied = await ownerOnly();
  if (denied) return denied;
  updateMoment(id, { is_hidden: isHidden });
  revalidateSite();
  return { error: undefined };
}

export async function deleteMomentAction(id: string) {
  if (!(await isOwner())) return;
  deleteMoment(id);
  revalidateSite();
}

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${base || "note"}-${Date.now().toString(36)}`;
}

export async function saveArticleAction(formData: FormData) {
  const denied = await ownerOnly();
  if (denied) return denied;
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const coverPath = emptyToNull(formData.get("cover_path"));
  const isPublished = formData.get("is_published") === "on";
  if (!title) return { error: "要写标题才行" };
  const publishedAt = readDate(formData);
  if (!publishedAt) return { error: "请选一个有效的日期和时间" };
  if (id) {
    const existing = articleById(id);
    if (!existing) return { error: "找不到这篇文章" };
    updateArticle(id, {
      title,
      body,
      cover_path: coverPath,
      cover_url: coverPath,
      is_published: isPublished,
      published_at: publishedAt,
    });
  } else {
    insertArticle({
      id: randomUUID(),
      title,
      slug: slugify(title),
      body,
      cover_path: coverPath,
      cover_url: coverPath,
      is_published: isPublished,
      published_at: publishedAt,
      created_at: publishedAt,
    });
  }
  revalidateSite();
  return { error: undefined };
}

export async function deleteArticleAction(id: string) {
  if (!(await isOwner())) return;
  deleteArticle(id);
  revalidateSite();
}

export async function signGuestbookAction(formData: FormData) {
  const nickname = String(formData.get("nickname") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const invalid = validateComment(nickname, body);
  if (invalid) return { error: invalid };
  insertComment(nickname, body, null);
  revalidateSite();
  return { error: undefined };
}

export async function replyGuestbookAction(formData: FormData) {
  const denied = await ownerOnly();
  if (denied) return denied;
  const parentId = String(formData.get("parent_id") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim() || readSettings().owner_display_name;
  const body = String(formData.get("body") ?? "").trim();
  const invalid = validateComment(nickname, body);
  if (invalid || !parentId) return { error: invalid || "回复不能空" };
  insertComment(nickname, body, parentId);
  revalidateSite();
  return { error: undefined };
}

export async function hideGuestbookAction(id: string, isHidden: boolean) {
  const denied = await ownerOnly();
  if (denied) return denied;
  hideComment(id, isHidden);
  revalidateSite();
  return { error: undefined };
}

export async function deleteGuestbookAction(id: string) {
  if (!(await isOwner())) return;
  deleteComment(id);
  revalidateSite();
}

export async function saveTrackAction(formData: FormData) {
  if (!(await isOwner())) return;
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const externalUrl = String(formData.get("external_url") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const isActive = formData.get("is_active") === "on" || formData.get("is_active") === "true";
  if (!title || !externalUrl) return;
  if (id) updateTrack(id, title, externalUrl, sortOrder, isActive);
  else insertTrack(title, externalUrl, sortOrder, isActive);
  revalidateSite();
}

export async function deleteTrackAction(id: string) {
  if (!(await isOwner())) return;
  deleteTrack(id);
  revalidateSite();
}

export async function updateProfileField(field: string, value: string) {
  const denied = await ownerOnly();
  if (denied) return denied;
  const map: Record<string, string> = {
    display_name: "owner_display_name",
    instagram_url: "instagram_url",
    x_url: "x_url",
    tiktok_url: "tiktok_url",
    youtube_url: "youtube_url",
  };
  const column = map[field] ?? field;
  if (!settingColumns.has(column)) return { error: "这个栏位不能改" };
  const link = column.endsWith("_url");
  patchSettings({ [column]: link ? value.trim() || null : value });
  revalidateSite();
  return { error: undefined };
}

const settingColumns = new Set([
  "site_title",
  "owner_display_name",
  "bio",
  "mood",
  "listening",
  "eating",
  "weather",
  "location",
  "doing",
  "sticker",
  "useless_note",
  "instagram_url",
  "x_url",
  "tiktok_url",
  "youtube_url",
]);

export async function updateCommentText(id: string, nickname: string, body: string) {
  const denied = await ownerOnly();
  if (denied) return denied;
  const invalid = validateComment(nickname.trim(), body.trim());
  if (invalid) return { error: invalid };
  updateComment(id, nickname.trim(), body.trim());
  revalidateSite();
  return { error: undefined };
}

export async function updatePhotoCaption(id: string, caption: string) {
  const denied = await ownerOnly();
  if (denied) return denied;
  updatePhoto(id, { caption });
  revalidateSite();
  return { error: undefined };
}

export async function updateMomentBody(id: string, body: string) {
  const denied = await ownerOnly();
  if (denied) return denied;
  updateMoment(id, { body });
  revalidateSite();
  return { error: undefined };
}

export async function updateArticleText(id: string, title: string, body: string) {
  const denied = await ownerOnly();
  if (denied) return denied;
  if (!title.trim()) return { error: "标题不能空" };
  writeArticleText(id, title.trim(), body);
  revalidateSite();
  return { error: undefined };
}

export async function updateTrackText(id: string, title: string, url: string) {
  const denied = await ownerOnly();
  if (denied) return denied;
  if (!title.trim() || !url.trim()) return { error: "歌名和外链都要留着" };
  updateTrack(id, title.trim(), url.trim());
  revalidateSite();
  return { error: undefined };
}

function imageFromPath(momentId: string, storagePath: string, sortOrder: number): MomentImage {
  return {
    id: `${momentId}-${sortOrder}`,
    moment_id: momentId,
    storage_path: storagePath,
    sort_order: sortOrder,
    public_url: storagePath,
  };
}

function validateComment(nickname: string, body: string) {
  if (nickname.length < 1 || nickname.length > 24) return "昵称请写 1～24 个字";
  if (body.length < 1 || body.length > 500) return "留言请写 1～500 个字";
  return null;
}

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function colorOr(value: FormDataEntryValue | null, fallback: string) {
  const text = String(value ?? "").trim();
  return /^#[0-9a-fA-F]{3,8}$/.test(text) ? text : fallback;
}

function fontOr(value: FormDataEntryValue | null) {
  const text = String(value ?? "");
  if (text === "cute" || text === "pixel" || text === "rounded") return text;
  return "rounded" as const;
}
