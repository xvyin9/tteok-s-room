import type { FontChoice, ThemeId } from "@/types/database";

export type ThemePreset = {
  id: ThemeId;
  name: string;
  blurb: string;
  background_color: string;
  accent_color: string;
  ink_color: string;
  font_family: FontChoice;
  show_decorations: boolean;
};

export const themes: ThemePreset[] = [
  {
    id: "pink-dream",
    name: "Pink Dream",
    blurb: "粉雾、爱心和软软的字",
    background_color: "#ffd0e6",
    accent_color: "#ff4f9a",
    ink_color: "#6a2450",
    font_family: "cute",
    show_decorations: true,
  },
  {
    id: "blue-star",
    name: "Blue Star",
    blurb: "蓝天、星星和现在这间小窝",
    background_color: "#8fd8ff",
    accent_color: "#2f7dff",
    ink_color: "#1d3d66",
    font_family: "rounded",
    show_decorations: true,
  },
  {
    id: "retro-blog",
    name: "Retro Blog",
    blurb: "旧纸、褐字、少一点闪光",
    background_color: "#f3e2c2",
    accent_color: "#c45c26",
    ink_color: "#3d2914",
    font_family: "pixel",
    show_decorations: false,
  },
  {
    id: "kawaii-diary",
    name: "Kawaii Diary",
    blurb: "日记本、奶油粉和圆字",
    background_color: "#fff0f8",
    accent_color: "#ff8ac9",
    ink_color: "#7a3d62",
    font_family: "cute",
    show_decorations: true,
  },
];

export function themeById(id: string) {
  return themes.find((theme) => theme.id === id) ?? themes[1];
}
