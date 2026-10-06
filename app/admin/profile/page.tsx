import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/queries";

export default async function ProfileAdminPage() {
  const settings = await getSettings();
  return (
    <div>
      <h2 className="site-title mb-3 text-xl">资料与公告栏</h2>
      <SettingsForm settings={settings} />
    </div>
  );
}
