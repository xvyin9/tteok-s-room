import { AppearanceForm } from "@/components/dashboard/appearance-form";
import { getSettings } from "@/lib/queries";

export default async function AppearancePage() {
  const settings = await getSettings();
  return <AppearanceForm settings={settings} />;
}