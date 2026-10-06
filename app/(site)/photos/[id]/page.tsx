import { getPhoto } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await getPhoto(id);
  if (!photo) notFound();
  return (
    <div>
      <p className="mb-2 text-xs">
        <Link href="/photos">« 回照片墙</Link>
      </p>
      <div className="photo-tile inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.public_url} alt={photo.caption} className="max-h-[70vh]" />
        <p className="mt-1 text-sm">{photo.caption}</p>
      </div>
    </div>
  );
}
