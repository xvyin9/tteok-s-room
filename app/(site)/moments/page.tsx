import { PhotoLightbox } from "@/components/photos/photo-lightbox";
import { getMoments } from "@/lib/queries";

export default async function MomentsPage() {
  const moments = await getMoments();
  return (
    <div>
      <h2 className="site-title text-2xl">动态</h2>
      <p className="mb-3 text-xs">像 QQ 空间说说，也像部落格短讯。</p>
      {moments.length ? (
        <div className="space-y-3">
          {moments.map((moment) => (
            <article className="guestbook-card" key={moment.id}>
              <time className="text-[11px] text-pink-700">
                {new Date(moment.created_at).toLocaleString("zh-TW")}
              </time>
              {moment.body ? (
                <p className="mt-1 whitespace-pre-wrap text-sm">{moment.body}</p>
              ) : null}
              {moment.images.length ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {moment.images.map((image) => (
                    <div className="photo-tile" key={image.id}>
                      <PhotoLightbox
                        src={image.public_url}
                        caption={moment.body}
                        thumbClassName="h-36 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p>还没有动态。</p>
      )}
    </div>
  );
}
