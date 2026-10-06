import { SiteShell } from "@/components/layout/site-shell";
import { isSupabaseConfigured } from "@/lib/config";
import { getSettings } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <SiteShell settings={settings} demo={!isSupabaseConfigured()}>
      {children}
    </SiteShell>
  );
}
