import {
  fallbackArticles,
  fallbackGuestbook,
  fallbackMoments,
  fallbackPhotos,
  fallbackSettings,
  fallbackTracks,
} from "@/lib/fallback";
import type {
  Album,
  Article,
  BackgroundMode,
  ExtraSocial,
  FontChoice,
  GuestbookMessage,
  MomentImage,
  MomentPost,
  Photo,
  SiteSettings,
  ThemeId,
  Track,
} from "@/types/database";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { DatabaseSync } from "node:sqlite";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "room.db");
const legacyPath = path.join(process.cwd(), "data", "room.json");

let database: DatabaseSync | null = null;

type SettingsRow = Omit<SiteSettings, "show_decorations" | "other_socials"> & {
  show_decorations: number;
  password_hash: string;
};

const settingColumns = [
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
  "avatar_url",
  "instagram_url",
  "x_url",
  "tiktok_url",
  "youtube_url",
  "hit_count",
  "today_count",
  "today_date",
  "updated_at",
  "theme",
  "background_mode",
  "background_image",
  "background_color",
  "accent_color",
  "ink_color",
  "font_family",
  "banner_image",
  "logo_url",
  "sidebar_image",
  "welcome_text",
  "home_title",
  "nav_home",
  "nav_diary",
  "nav_photos",
  "nav_notes",
  "nav_guest",
  "show_decorations",
] as const;

export function db() {
  if (!database) {
    mkdirSync(path.dirname(dbPath), { recursive: true });
    database = new DatabaseSync(dbPath);
    database.exec("pragma journal_mode = wal");
    database.exec("pragma foreign_keys = on");
    migrate(database);
  }
  return database;
}

function migrate(database: DatabaseSync) {
  database.exec(`
    create table if not exists settings (
      id text primary key,
      site_title text not null,
      owner_display_name text not null,
      bio text not null,
      mood text not null,
      listening text not null,
      eating text not null,
      weather text not null,
      location text not null,
      doing text not null,
      sticker text not null,
      useless_note text not null,
      avatar_url text,
      instagram_url text,
      x_url text,
      tiktok_url text,
      youtube_url text,
      hit_count integer not null,
      today_count integer not null,
      today_date text not null,
      updated_at text not null,
      theme text not null,
      background_mode text not null,
      background_image text,
      background_color text not null,
      accent_color text not null,
      ink_color text not null,
      font_family text not null,
      banner_image text,
      logo_url text,
      sidebar_image text,
      welcome_text text not null,
      home_title text not null,
      nav_home text not null,
      nav_diary text not null,
      nav_photos text not null,
      nav_notes text not null,
      nav_guest text not null,
      show_decorations integer not null,
      password_hash text not null
    );
    create table if not exists albums (
      id text primary key,
      name text not null,
      sort_order integer not null
    );
    create table if not exists photos (
      id text primary key,
      album_id text,
      storage_path text not null,
      caption text not null,
      is_hidden integer not null,
      created_at text not null,
      public_url text not null
    );
    create table if not exists moments (
      id text primary key,
      body text not null,
      is_hidden integer not null,
      created_at text not null,
      images_json text not null
    );
    create table if not exists articles (
      id text primary key,
      title text not null,
      slug text not null unique,
      body text not null,
      cover_path text,
      cover_url text,
      is_published integer not null,
      published_at text,
      created_at text not null
    );
    create table if not exists tracks (
      id text primary key,
      title text not null,
      external_url text not null,
      sort_order integer not null,
      is_active integer not null
    );
    create table if not exists comments (
      id text primary key,
      parent_id text,
      nickname text not null,
      body text not null,
      is_hidden integer not null,
      created_at text not null
    );
    create table if not exists extra_socials (
      id text primary key,
      label text not null,
      url text not null,
      sort_order integer not null
    );
    create table if not exists meta (
      key text primary key,
      value text not null
    );
  `);
  addColumns(database);
  const count = database.prepare("select count(*) as n from settings").get() as { n: number };
  if (count.n === 0) seed(database);
  const ready = database.prepare("select value from meta where key = 'content_ready'").get() as
    | { value: string }
    | undefined;
  if (!ready) {
    const photos = database.prepare("select count(*) as n from photos").get() as { n: number };
    if (photos.n === 0) fillContentIfEmpty(database);
    database.prepare("insert into meta (key, value) values ('content_ready', '1')").run();
  }
  database.exec(`
    update photos set album_id = (select id from albums order by sort_order limit 1)
      where album_id is null and exists (select 1 from albums);
  `);
}

function addColumns(database: DatabaseSync) {
  const add = (table: string, name: string, definition: string) => {
    const columns = database.prepare(`pragma table_info(${table})`).all() as { name: string }[];
    if (columns.some((column) => column.name === name)) return;
    database.exec(`alter table ${table} add column ${name} ${definition}`);
  };
  add("albums", "description", "text not null default ''");
  add("albums", "cover_photo_id", "text");
  add("albums", "created_at", "text not null default ''");
  add("moments", "title", "text not null default ''");
  add("moments", "summary", "text not null default ''");
  add("moments", "published_at", "text");
  database
    .prepare("update albums set created_at = ? where created_at is null or created_at = ''")
    .run(new Date().toISOString());
  database.exec(`
    update moments set published_at = created_at where published_at is null or published_at = '';
    update moments set title = substr(replace(body, char(10), ' '), 1, 24) where title is null or title = '';
    update moments set summary = substr(replace(body, char(10), ' '), 1, 80) where summary is null or summary = '';
    update photos set album_id = (select id from albums order by sort_order limit 1)
      where album_id is null and exists (select 1 from albums);
  `);
}

function fillContentIfEmpty(database: DatabaseSync) {
  const photos = database.prepare("select count(*) as n from photos").get() as { n: number };
  if (photos.n > 0) return;
  const legacy = readLegacy();
  const albumId = randomUUID();
  database.prepare("insert into albums (id, name, sort_order) values (?, ?, ?)").run(albumId, "默认相册", 0);
  for (const photo of legacy?.photos ?? fallbackPhotos) {
    database
      .prepare(
        "insert into photos (id, album_id, storage_path, caption, is_hidden, created_at, public_url) values (?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        photo.id,
        photo.album_id ?? null,
        photo.storage_path,
        photo.caption,
        photo.is_hidden ? 1 : 0,
        photo.created_at,
        photo.public_url,
      );
  }
  if ((database.prepare("select count(*) as n from moments").get() as { n: number }).n === 0) {
    for (const moment of legacy?.moments ?? fallbackMoments) {
      database
        .prepare("insert into moments (id, body, is_hidden, created_at, images_json) values (?, ?, ?, ?, ?)")
        .run(moment.id, moment.body, moment.is_hidden ? 1 : 0, moment.created_at, JSON.stringify(moment.images));
    }
  }
  if ((database.prepare("select count(*) as n from articles").get() as { n: number }).n === 0) {
    for (const article of legacy?.articles ?? fallbackArticles) {
      database
        .prepare(
          "insert into articles (id, title, slug, body, cover_path, cover_url, is_published, published_at, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .run(
          article.id,
          article.title,
          article.slug,
          article.body,
          article.cover_path,
          article.cover_url,
          article.is_published ? 1 : 0,
          article.published_at,
          article.created_at,
        );
    }
  }
  if ((database.prepare("select count(*) as n from tracks").get() as { n: number }).n === 0) {
    for (const track of legacy?.tracks ?? fallbackTracks) {
      database
        .prepare("insert into tracks (id, title, external_url, sort_order, is_active) values (?, ?, ?, ?, ?)")
        .run(track.id, track.title, track.external_url, track.sort_order, track.is_active ? 1 : 0);
    }
  }
  if ((database.prepare("select count(*) as n from comments").get() as { n: number }).n === 0) {
    for (const comment of legacy?.comments ?? flatten(fallbackGuestbook)) {
      database
        .prepare(
          "insert into comments (id, parent_id, nickname, body, is_hidden, created_at) values (?, ?, ?, ?, ?, ?)",
        )
        .run(
          comment.id,
          comment.parent_id,
          comment.nickname,
          comment.body,
          comment.is_hidden ? 1 : 0,
          comment.created_at,
        );
    }
  }
}

function seed(database: DatabaseSync) {
  const legacy = readLegacy();
  const settings = { ...fallbackSettings, ...legacy?.settings, id: "room" };
  insertSettings(database, settings, hashPassword("memory-room"));
  const albumId = randomUUID();
  database.prepare("insert into albums (id, name, sort_order) values (?, ?, ?)").run(albumId, "默认相册", 0);
  for (const photo of legacy?.photos ?? fallbackPhotos) {
    database
      .prepare(
        "insert into photos (id, album_id, storage_path, caption, is_hidden, created_at, public_url) values (?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        photo.id,
        photo.album_id ?? null,
        photo.storage_path,
        photo.caption,
        photo.is_hidden ? 1 : 0,
        photo.created_at,
        photo.public_url,
      );
  }
  for (const moment of legacy?.moments ?? fallbackMoments) {
    database
      .prepare("insert into moments (id, body, is_hidden, created_at, images_json) values (?, ?, ?, ?, ?)")
      .run(moment.id, moment.body, moment.is_hidden ? 1 : 0, moment.created_at, JSON.stringify(moment.images));
  }
  for (const article of legacy?.articles ?? fallbackArticles) {
    database
      .prepare(
        "insert into articles (id, title, slug, body, cover_path, cover_url, is_published, published_at, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        article.id,
        article.title,
        article.slug,
        article.body,
        article.cover_path,
        article.cover_url,
        article.is_published ? 1 : 0,
        article.published_at,
        article.created_at,
      );
  }
  for (const track of legacy?.tracks ?? fallbackTracks) {
    database
      .prepare("insert into tracks (id, title, external_url, sort_order, is_active) values (?, ?, ?, ?, ?)")
      .run(track.id, track.title, track.external_url, track.sort_order, track.is_active ? 1 : 0);
  }
  const comments = legacy?.comments ?? flatten(fallbackGuestbook);
  for (const comment of comments) {
    database
      .prepare(
        "insert into comments (id, parent_id, nickname, body, is_hidden, created_at) values (?, ?, ?, ?, ?, ?)",
      )
      .run(comment.id, comment.parent_id, comment.nickname, comment.body, comment.is_hidden ? 1 : 0, comment.created_at);
  }
}

function flatten(messages: GuestbookMessage[]): Omit<GuestbookMessage, "replies">[] {
  const rows: Omit<GuestbookMessage, "replies">[] = [];
  for (const message of messages) {
    const { replies, ...rest } = message;
    rows.push(rest);
    rows.push(...flatten(replies));
  }
  return rows;
}

function readLegacy() {
  if (!existsSync(legacyPath)) return null;
  try {
    return JSON.parse(readFileSync(legacyPath, "utf8")) as {
      settings?: Partial<SiteSettings>;
      photos?: Photo[];
      moments?: MomentPost[];
      articles?: Article[];
      tracks?: Track[];
      comments?: Omit<GuestbookMessage, "replies">[];
    };
  } catch {
    return null;
  }
}

function insertSettings(database: DatabaseSync, settings: SiteSettings, passwordHash: string) {
  database
    .prepare(
      `insert into settings (
        id, site_title, owner_display_name, bio, mood, listening, eating, weather, location, doing,
        sticker, useless_note, avatar_url, instagram_url, x_url, tiktok_url, youtube_url,
        hit_count, today_count, today_date, updated_at, theme, background_mode, background_image,
        background_color, accent_color, ink_color, font_family, banner_image, logo_url, sidebar_image,
        welcome_text, home_title, nav_home, nav_diary, nav_photos, nav_notes, nav_guest,
        show_decorations, password_hash
      ) values (${Array(40).fill("?").join(", ")})`,
    )
    .run(
      "room",
      settings.site_title,
      settings.owner_display_name,
      settings.bio,
      settings.mood,
      settings.listening,
      settings.eating,
      settings.weather,
      settings.location,
      settings.doing,
      settings.sticker,
      settings.useless_note,
      settings.avatar_url,
      settings.instagram_url,
      settings.x_url,
      settings.tiktok_url,
      settings.youtube_url,
      settings.hit_count,
      settings.today_count,
      settings.today_date,
      settings.updated_at,
      settings.theme,
      settings.background_mode,
      settings.background_image,
      settings.background_color,
      settings.accent_color,
      settings.ink_color,
      settings.font_family,
      settings.banner_image,
      settings.logo_url,
      settings.sidebar_image,
      settings.welcome_text,
      settings.home_title,
      settings.nav_home,
      settings.nav_diary,
      settings.nav_photos,
      settings.nav_notes,
      settings.nav_guest,
      settings.show_decorations ? 1 : 0,
      passwordHash,
    );
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function checkPassword(password: string) {
  const row = db().prepare("select password_hash from settings where id = 'room'").get() as {
    password_hash: string;
  };
  const [salt, hash] = row.password_hash.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 32);
  const stored = Buffer.from(hash, "hex");
  if (stored.length !== next.length) return false;
  return timingSafeEqual(stored, next);
}

export function setPassword(password: string) {
  db().prepare("update settings set password_hash = ? where id = 'room'").run(hashPassword(password));
}

function socials(): ExtraSocial[] {
  return db()
    .prepare("select id, label, url, sort_order from extra_socials order by sort_order, label")
    .all() as ExtraSocial[];
}

export function readSettings(): SiteSettings {
  const row = db().prepare("select * from settings where id = 'room'").get() as SettingsRow;
  return {
    ...row,
    theme: row.theme as ThemeId,
    background_mode: row.background_mode as BackgroundMode,
    font_family: row.font_family as FontChoice,
    show_decorations: Boolean(row.show_decorations),
    other_socials: socials(),
  };
}

export function patchSettings(patch: Partial<SiteSettings>) {
  const entries = Object.entries(patch).filter(([key, value]) => {
    return (
      key !== "updated_at" &&
      settingColumns.includes(key as (typeof settingColumns)[number]) &&
      value !== undefined
    );
  });
  if (!entries.length) return;
  const assignments = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = entries.map(([key, value]) => {
    if (key === "show_decorations") return value ? 1 : 0;
    return value;
  });
  db()
    .prepare(`update settings set ${assignments}, updated_at = ? where id = 'room'`)
    .run(...values, new Date().toISOString());
}

export function bumpHits() {
  const settings = readSettings();
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = settings.today_date === today ? settings.today_count + 1 : 1;
  patchSettings({
    hit_count: settings.hit_count + 1,
    today_count: todayCount,
    today_date: today,
  });
  return { hit_count: settings.hit_count + 1, today_count: todayCount };
}

export function listAlbums(): Album[] {
  const rows = db()
    .prepare(
      `select
        a.id, a.name, a.description, a.cover_photo_id, a.sort_order, a.created_at,
        (select count(*) from photos p where p.album_id = a.id and p.is_hidden = 0) as photo_count,
        coalesce(
          (select public_url from photos p where p.id = a.cover_photo_id),
          (select public_url from photos p where p.album_id = a.id and p.is_hidden = 0 order by p.created_at limit 1)
        ) as cover_url
      from albums a
      order by a.sort_order asc, a.created_at desc`,
    )
    .all() as {
      id: string;
      name: string;
      description: string | null;
      cover_photo_id: string | null;
      sort_order: number;
      created_at: string;
      photo_count: number;
      cover_url: string | null;
    }[];
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    cover_photo_id: row.cover_photo_id,
    cover_url: row.cover_url,
    photo_count: Number(row.photo_count),
    sort_order: Number(row.sort_order),
    created_at: row.created_at,
  }));
}

export function albumById(id: string) {
  return listAlbums().find((album) => album.id === id) ?? null;
}

export function insertAlbum(input: {
  name: string;
  description?: string;
  createdAt: string;
  sortOrder?: number;
}) {
  const sort = input.sortOrder ?? listAlbums().length;
  const id = randomUUID();
  db()
    .prepare(
      "insert into albums (id, name, description, cover_photo_id, sort_order, created_at) values (?, ?, ?, null, ?, ?)",
    )
    .run(id, input.name.trim(), input.description?.trim() ?? "", sort, input.createdAt);
  return id;
}

export function updateAlbum(
  id: string,
  input: { name: string; description: string; createdAt: string; sortOrder: number; coverPhotoId: string | null },
) {
  db()
    .prepare(
      "update albums set name = ?, description = ?, created_at = ?, sort_order = ?, cover_photo_id = ? where id = ?",
    )
    .run(input.name.trim(), input.description.trim(), input.createdAt, input.sortOrder, input.coverPhotoId, id);
}

export function deleteAlbum(id: string) {
  db().prepare("update photos set album_id = null where album_id = ?").run(id);
  db().prepare("delete from albums where id = ?").run(id);
}

export function listPhotos(includeHidden = false): Photo[] {
  const rows = db()
    .prepare(
      `select id, album_id, storage_path, caption, is_hidden, created_at, public_url
       from photos ${includeHidden ? "" : "where is_hidden = 0"}
       order by created_at desc`,
    )
    .all() as (Omit<Photo, "created_by" | "is_hidden"> & { is_hidden: number })[];
  return rows.map((row) => ({ ...row, created_by: null, is_hidden: Boolean(row.is_hidden) }));
}

export function insertPhoto(storagePath: string, caption: string, albumId: string | null) {
  const id = randomUUID();
  const created = new Date().toISOString();
  db()
    .prepare(
      "insert into photos (id, album_id, storage_path, caption, is_hidden, created_at, public_url) values (?, ?, ?, ?, 0, ?, ?)",
    )
    .run(id, albumId, storagePath, caption, created, storagePath);
}

export function updatePhoto(id: string, patch: { caption?: string; album_id?: string | null; is_hidden?: boolean }) {
  if (patch.caption !== undefined) db().prepare("update photos set caption = ? where id = ?").run(patch.caption, id);
  if (patch.album_id !== undefined) db().prepare("update photos set album_id = ? where id = ?").run(patch.album_id, id);
  if (patch.is_hidden !== undefined) {
    db().prepare("update photos set is_hidden = ? where id = ?").run(patch.is_hidden ? 1 : 0, id);
  }
}

export function deletePhoto(id: string) {
  db().prepare("update albums set cover_photo_id = null where cover_photo_id = ?").run(id);
  db().prepare("delete from photos where id = ?").run(id);
}

export function listMoments(includeHidden = false): MomentPost[] {
  const rows = db()
    .prepare(
      `select id, title, summary, body, is_hidden, published_at, created_at, images_json from moments
       ${includeHidden ? "" : "where is_hidden = 0"}
       order by coalesce(published_at, created_at) desc`,
    )
    .all() as {
      id: string;
      title: string;
      summary: string;
      body: string;
      is_hidden: number;
      published_at: string | null;
      created_at: string;
      images_json: string;
    }[];
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    body: row.body,
    created_by: null,
    is_hidden: Boolean(row.is_hidden),
    published_at: row.published_at || row.created_at,
    created_at: row.created_at,
    images: JSON.parse(row.images_json) as MomentImage[],
  }));
}

export function momentById(id: string) {
  return listMoments(true).find((moment) => moment.id === id) ?? null;
}

export function insertMoment(moment: {
  id: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
  images: MomentImage[];
}) {
  db()
    .prepare(
      "insert into moments (id, title, summary, body, is_hidden, published_at, created_at, images_json) values (?, ?, ?, ?, 0, ?, ?, ?)",
    )
    .run(
      moment.id,
      moment.title,
      moment.summary,
      moment.body,
      moment.publishedAt,
      moment.publishedAt,
      JSON.stringify(moment.images),
    );
}

export function updateMoment(
  id: string,
  patch: {
    title?: string;
    summary?: string;
    body?: string;
    publishedAt?: string;
    images?: MomentImage[];
    is_hidden?: boolean;
  },
) {
  if (patch.title !== undefined) db().prepare("update moments set title = ? where id = ?").run(patch.title, id);
  if (patch.summary !== undefined) db().prepare("update moments set summary = ? where id = ?").run(patch.summary, id);
  if (patch.body !== undefined) db().prepare("update moments set body = ? where id = ?").run(patch.body, id);
  if (patch.publishedAt !== undefined) {
    db().prepare("update moments set published_at = ? where id = ?").run(patch.publishedAt, id);
  }
  if (patch.images !== undefined) {
    db().prepare("update moments set images_json = ? where id = ?").run(JSON.stringify(patch.images), id);
  }
  if (patch.is_hidden !== undefined) {
    db().prepare("update moments set is_hidden = ? where id = ?").run(patch.is_hidden ? 1 : 0, id);
  }
}

export function deleteMoment(id: string) {
  db().prepare("delete from moments where id = ?").run(id);
}

export function listArticles(includeDrafts = false): Article[] {
  const rows = db()
    .prepare(
      `select * from articles ${includeDrafts ? "" : "where is_published = 1"}
       order by coalesce(published_at, created_at) desc`,
    )
    .all() as (Omit<Article, "is_published" | "created_by"> & { is_published: number })[];
  return rows.map((row) => ({ ...row, created_by: null, is_published: Boolean(row.is_published) }));
}

export function articleBySlug(slug: string) {
  return listArticles(true).find((article) => article.slug === slug) ?? null;
}

export function articleById(id: string) {
  return listArticles(true).find((article) => article.id === id) ?? null;
}

export function insertArticle(article: Omit<Article, "created_by">) {
  db()
    .prepare(
      "insert into articles (id, title, slug, body, cover_path, cover_url, is_published, published_at, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .run(
      article.id,
      article.title,
      article.slug,
      article.body,
      article.cover_path,
      article.cover_url,
      article.is_published ? 1 : 0,
      article.published_at,
      article.created_at,
    );
}

export function updateArticle(id: string, article: Omit<Article, "id" | "slug" | "created_by" | "created_at">) {
  db()
    .prepare(
      "update articles set title = ?, body = ?, cover_path = ?, cover_url = ?, is_published = ?, published_at = ? where id = ?",
    )
    .run(
      article.title,
      article.body,
      article.cover_path,
      article.cover_url,
      article.is_published ? 1 : 0,
      article.published_at,
      id,
    );
}

export function updateArticleText(id: string, title: string, body: string) {
  db().prepare("update articles set title = ?, body = ? where id = ?").run(title, body, id);
}

export function deleteArticle(id: string) {
  db().prepare("delete from articles where id = ?").run(id);
}

export function listTracks(includeInactive = false): Track[] {
  const rows = db()
    .prepare(
      `select id, title, external_url, sort_order, is_active from tracks
       ${includeInactive ? "" : "where is_active = 1"} order by sort_order, title`,
    )
    .all() as (Omit<Track, "is_active"> & { is_active: number })[];
  return rows.map((row) => ({ ...row, is_active: Boolean(row.is_active) }));
}

export function insertTrack(title: string, url: string, sortOrder: number, isActive: boolean) {
  db()
    .prepare("insert into tracks (id, title, external_url, sort_order, is_active) values (?, ?, ?, ?, ?)")
    .run(randomUUID(), title, url, sortOrder, isActive ? 1 : 0);
}

export function updateTrack(id: string, title: string, url: string, sortOrder?: number, isActive?: boolean) {
  db().prepare("update tracks set title = ?, external_url = ? where id = ?").run(title, url, id);
  if (sortOrder !== undefined) db().prepare("update tracks set sort_order = ? where id = ?").run(sortOrder, id);
  if (isActive !== undefined) db().prepare("update tracks set is_active = ? where id = ?").run(isActive ? 1 : 0, id);
}

export function deleteTrack(id: string) {
  db().prepare("delete from tracks where id = ?").run(id);
}

export function listComments(includeHidden = false) {
  const rows = db()
    .prepare(
      `select id, parent_id, nickname, body, is_hidden, created_at from comments
       ${includeHidden ? "" : "where is_hidden = 0"} order by created_at asc`,
    )
    .all() as (Omit<GuestbookMessage, "replies" | "created_by" | "is_hidden"> & { is_hidden: number })[];
  return rows.map((row) => ({ ...row, created_by: null, is_hidden: Boolean(row.is_hidden) }));
}

export function insertComment(nickname: string, body: string, parentId: string | null) {
  db()
    .prepare("insert into comments (id, parent_id, nickname, body, is_hidden, created_at) values (?, ?, ?, ?, 0, ?)")
    .run(randomUUID(), parentId, nickname, body, new Date().toISOString());
}

export function updateComment(id: string, nickname: string, body: string) {
  db().prepare("update comments set nickname = ?, body = ? where id = ?").run(nickname, body, id);
}

export function hideComment(id: string, isHidden: boolean) {
  db().prepare("update comments set is_hidden = ? where id = ?").run(isHidden ? 1 : 0, id);
}

export function deleteComment(id: string) {
  const rows = listComments(true);
  const drop = new Set<string>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const comment of rows) {
      if (comment.parent_id && drop.has(comment.parent_id) && !drop.has(comment.id)) {
        drop.add(comment.id);
        grew = true;
      }
    }
  }
  const statement = db().prepare("delete from comments where id = ?");
  for (const commentId of drop) statement.run(commentId);
}

export function insertExtraSocial(label: string, url: string) {
  const sort = socials().length;
  db()
    .prepare("insert into extra_socials (id, label, url, sort_order) values (?, ?, ?, ?)")
    .run(randomUUID(), label.trim(), url.trim(), sort);
}

export function deleteExtraSocial(id: string) {
  db().prepare("delete from extra_socials where id = ?").run(id);
}
