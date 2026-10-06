export type StaffRole = "owner" | "friend";

export type UserRow = {
  id: string;
  role: StaffRole;
  display_name: string;
  bio: string;
  mood: string;
  listening: string;
  eating: string;
  weather: string;
  location: string;
  doing: string;
  sticker: string;
  useless_note: string;
  avatar_url: string | null;
  site_title: string;
  hit_count: number;
  today_count: number;
  today_date: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  site_title: string;
  owner_display_name: string;
  bio: string;
  mood: string;
  listening: string;
  eating: string;
  weather: string;
  location: string;
  doing: string;
  sticker: string;
  useless_note: string;
  avatar_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  hit_count: number;
  today_count: number;
  today_date: string;
  updated_at: string;
  theme: ThemeId;
  background_mode: BackgroundMode;
  background_image: string | null;
  background_color: string;
  accent_color: string;
  ink_color: string;
  font_family: FontChoice;
  banner_image: string | null;
  logo_url: string | null;
  sidebar_image: string | null;
  welcome_text: string;
  home_title: string;
  nav_home: string;
  nav_diary: string;
  nav_photos: string;
  nav_notes: string;
  nav_guest: string;
  show_decorations: boolean;
  other_socials: ExtraSocial[];
};

export type Photo = {
  id: string;
  album_id: string | null;
  storage_path: string;
  caption: string;
  created_by: string | null;
  is_hidden: boolean;
  created_at: string;
  public_url: string;
};

export type Album = {
  id: string;
  name: string;
  description: string;
  cover_photo_id: string | null;
  cover_url: string | null;
  photo_count: number;
  sort_order: number;
  created_at: string;
};

export type ExtraSocial = {
  id: string;
  label: string;
  url: string;
  sort_order: number;
};

export type ThemeId = "pink-dream" | "blue-star" | "retro-blog" | "kawaii-diary";
export type FontChoice = "rounded" | "cute" | "pixel";
export type BackgroundMode = "theme" | "color" | "image";

export type MomentImage = {
  id: string;
  moment_id: string;
  storage_path: string;
  sort_order: number;
  public_url: string;
};

export type MomentPost = {
  id: string;
  title: string;
  summary: string;
  body: string;
  created_by: string | null;
  is_hidden: boolean;
  published_at: string;
  created_at: string;
  images: MomentImage[];
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  body: string;
  cover_path: string | null;
  cover_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
};

export type GuestbookMessage = {
  id: string;
  parent_id: string | null;
  nickname: string;
  body: string;
  created_by: string | null;
  is_hidden: boolean;
  created_at: string;
  replies: GuestbookMessage[];
};

export type Track = {
  id: string;
  title: string;
  external_url: string;
  sort_order: number;
  is_active: boolean;
};

export type StaffProfile = {
  id: string;
  role: StaffRole;
  display_name: string;
};

export type SocialPlatform = "instagram" | "x" | "tiktok" | "youtube";
