import { PlayerProvider } from "@/components/player/player-context";
import { SkyField } from "@/components/skin/charms";
import { getSettings, getTracks } from "@/lib/queries";
import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Press_Start_2P, ZCOOL_KuaiLe } from "next/font/google";
import "./globals.css";

const rounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-rounded",
});

const cute = ZCOOL_KuaiLe({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cute",
});

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.home_title || settings.site_title,
    description: settings.bio,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [tracks, settings] = await Promise.all([getTracks(), getSettings()]);
  const font =
    settings.font_family === "cute"
      ? cute.className
      : settings.font_family === "pixel"
        ? pixel.className
        : rounded.className;
  const customBackground =
    settings.background_mode === "image" && settings.background_image
      ? {
          backgroundImage: `url("${settings.background_image}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : settings.background_mode === "color"
        ? { backgroundColor: settings.background_color, backgroundImage: "none" }
        : undefined;

  return (
    <html
      lang="zh-Hant"
      className={`${rounded.variable} ${cute.variable} ${pixel.variable} h-full`}
      style={{
        ["--room-accent" as string]: settings.accent_color,
        ["--frame" as string]: settings.accent_color,
        ["--widget-title" as string]: settings.accent_color,
        ["--room-ink" as string]: settings.ink_color,
      }}
    >
      <body
        className={`${font} theme-${settings.theme} ${settings.show_decorations ? "" : "decor-off"} min-h-full`}
        style={customBackground}
      >
        <SkyField />
        <div className="sky-content">
          <PlayerProvider tracks={tracks}>{children}</PlayerProvider>
        </div>
      </body>
    </html>
  );
}
