import { MomentEditor } from "@/components/dashboard/moment-editor";
import { getMoments } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditMomentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const moment = (await getMoments(true)).find((item) => item.id === id);
  if (!moment) notFound();
  return (
    <div>
      <p className="mb-2 text-xs">
        <Link href="/dashboard/moments">« Moment Manager</Link>
      </p>
      <MomentEditor moment={moment} />
    </div>
  );
}
