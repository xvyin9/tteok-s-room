import { MomentEditor } from "@/components/dashboard/moment-editor";
import { deleteMomentAction } from "@/lib/actions";
import { getMoments } from "@/lib/queries";
import Link from "next/link";

export default async function MomentManagerPage() {
  const moments = await getMoments(true);
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Moment Manager</h2>
      <MomentEditor />
      {moments.map((moment) => (
        <article className="widget" key={moment.id}>
          <div className="widget-body flex items-center justify-between gap-2">
            <div>
              <Link className="font-bold" href={`/dashboard/moments/${moment.id}`}>
                {moment.title}
              </Link>
              <p className="text-[11px]">{new Date(moment.published_at).toLocaleString("zh-TW")}</p>
            </div>
            <form action={deleteMomentAction.bind(null, moment.id)}>
              <button className="btn-3d" type="submit">
                删除
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
