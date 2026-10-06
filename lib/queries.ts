import {
  albumById,
  articleById,
  articleBySlug,
  listAlbums,
  listArticles,
  listComments,
  listMoments,
  listPhotos,
  listTracks,
  momentById,
  readSettings,
} from "@/lib/db";
import type { GuestbookMessage } from "@/types/database";

function nestComments(rows: ReturnType<typeof listComments>): GuestbookMessage[] {
  const map = new Map<string, GuestbookMessage>();
  for (const row of rows) map.set(row.id, { ...row, replies: [] });
  const roots: GuestbookMessage[] = [];
  for (const row of rows) {
    const node = map.get(row.id)!;
    if (row.parent_id && map.has(row.parent_id)) map.get(row.parent_id)!.replies.push(node);
    else if (!row.parent_id) roots.push(node);
  }
  return roots.reverse();
}

export async function getSettings() {
  return readSettings();
}

export async function getAlbums() {
  return listAlbums();
}

export async function getAlbum(id: string) {
  return albumById(id);
}

export async function getTracks(includeInactive = false) {
  return listTracks(includeInactive);
}

export async function getPhotos(includeHidden = false) {
  return listPhotos(includeHidden);
}

export async function getPhoto(id: string) {
  return listPhotos(true).find((photo) => photo.id === id && !photo.is_hidden) ?? null;
}

export async function getMoments(includeHidden = false) {
  return listMoments(includeHidden);
}

export async function getMoment(id: string) {
  const moment = momentById(id);
  if (!moment || moment.is_hidden) return null;
  return moment;
}

export async function getArticles(includeDrafts = false) {
  return listArticles(includeDrafts);
}

export async function getArticleBySlug(slug: string) {
  const article = articleBySlug(slug);
  if (!article || !article.is_published) return null;
  return article;
}

export async function getArticleById(id: string) {
  return articleById(id);
}

export async function getGuestbook(includeHidden = false) {
  return nestComments(listComments(includeHidden));
}
