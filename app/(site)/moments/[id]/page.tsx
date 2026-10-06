import { PhotoLightbox } from "@/components/photos/photo-lightbox";
import { getMoment } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MomentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const moment = await getMoment(id);
  if (!moment) notFound();
  return (
    <article>
      <p className="mb-2 text-xs">
        <Link href="/moments">« 回日记</Link>
      </p>
      <h2 className="site-title mb-2 text-3xl">{moment.title}</h2>
      <p className="mb-3 text-[11px]">{new Date(moment.published_at).toLocaleString("zh-TW")}</p>
      {moment.images.length ? (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {moment.images.map((image) => (
            <PhotoLightbox key={image.id} src={image.public_url} caption={moment.title} />
          ))}
        </div>
      ) : null}
      <div className="whitespace-pre-wrap text-sm leading-7">{moment.body}</div>
    </article>
  );
}
