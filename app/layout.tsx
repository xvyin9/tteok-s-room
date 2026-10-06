import { PlayerProvider } from "@/components/player/player-context";
import { getTracks } from "@/lib/queries";
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

export const metadata: Metadata = {
  title: "tteok's Memory Room",
  description: "tteok 的记忆小窝",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const tracks = await getTracks();
  return (
    <html
      lang="zh-Hant"
      className={`${rounded.variable} ${cute.variable} ${pixel.variable} h-full`}
    >
      <body className={`${rounded.className} min-h-full`}>
        <PlayerProvider tracks={tracks}>{children}</PlayerProvider>
      </body>
    </html>
  );
}
