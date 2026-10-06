import {
  fallbackArticles,
  fallbackGuestbook,
  fallbackMoments,
  fallbackPhotos,
  fallbackSettings,
  fallbackTracks,
} from "@/lib/fallback";
import type {
  Article,
  GuestbookMessage,
  MomentPost,
  Photo,
  SiteSettings,
  Track,
} from "@/types/database";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";

export type FlatComment = Omit<GuestbookMessage, "replies">;

export type RoomFile = {
  settings: SiteSettings;
  tracks: Track[];
  photos: Photo[];
  moments: MomentPost[];
  articles: Article[];
  comments: FlatComment[];
};

const filePath = path.join(process.cwd(), "data", "room.json");

function flatten(messages: GuestbookMessage[]): FlatComment[] {
  const rows: FlatComment[] = [];
  for (const message of messages) {
    const { replies, ...rest } = message;
    rows.push(rest);
    rows.push(...flatten(replies));
  }
  return rows;
}

function seed(): RoomFile {
  return {
    settings: structuredClone(fallbackSettings),
    tracks: structuredClone(fallbackTracks),
    photos: structuredClone(fallbackPhotos),
    moments: structuredClone(fallbackMoments),
    articles: structuredClone(fallbackArticles),
    comments: flatten(fallbackGuestbook),
  };
}

export function readRoom(): RoomFile {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as RoomFile;
  } catch {
    const room = seed();
    writeRoom(room);
    return room;
  }
}

export function writeRoom(room: RoomFile) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const temp = `${filePath}.tmp`;
  writeFileSync(temp, JSON.stringify(room, null, 2));
  renameSync(temp, filePath);
}

export function updateRoom(change: (room: RoomFile) => void) {
  const room = readRoom();
  change(room);
  writeRoom(room);
  return room;
}
