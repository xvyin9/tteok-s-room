import { getMoments } from "@/lib/queries";
import Link from "next/link";

export default async function MomentsPage() {
  const moments = await getMoments();
  return (
    <div>
      <h2 className="site-title text-2xl">图文日记</h2>
      <p className="mb-3 text-xs">一篇一篇，像翻旧本子。</p>
      {moments.length ? (
        <div className="space-y-3">
          {moments.map((moment) => (
            <Link className="diary-card" href={`/moments/${moment.id}`} key={moment.id}>
              {moment.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={moment.images[0].public_url} alt="" />
              ) : (
                <div className="diary-cover-empty">没有封面</div>
              )}
              <div>
                <time>{new Date(moment.published_at).toLocaleString("zh-TW")}</time>
                <strong>{moment.title}</strong>
                <p>{moment.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>还没有日记。</p>
      )}
    </div>
  );
}
