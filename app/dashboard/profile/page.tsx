import { ProfileForm } from "@/components/dashboard/profile-form";
import { getSettings } from "@/lib/queries";

export default async function ProfilePage() {
  const settings = await getSettings();
  return <ProfileForm settings={settings} />;
}
