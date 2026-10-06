import { MomentComposer } from "@/components/admin/moment-composer";
import { deleteMomentAction, toggleMomentHiddenAction } from "@/lib/actions";
import { getMoments } from "@/lib/queries";

export default async function MomentsAdminPage() {
  const moments = await getMoments(true);
  return (
    <div>
      <h2 className="site-title mb-3 text-xl">动态管理</h2>
      <MomentComposer />
      <div className="mt-3 space-y-2">
        {moments.map((moment) => (
          <article className="guestbook-card" key={moment.id}>
            <p className="text-[11px]">
              {new Date(moment.created_at).toLocaleString("zh-TW")}
              {moment.is_hidden ? " · 已隐藏" : ""}
            </p>
            <p className="whitespace-pre-wrap text-sm">{moment.body}</p>
            <div className="mt-2 flex gap-1">
              <form
                action={async () => {
                  await toggleMomentHiddenAction(moment.id, !moment.is_hidden);
                }}
              >
                <button className="btn-3d" type="submit">
                  {moment.is_hidden ? "显示" : "隐藏"}
                </button>
              </form>
              <form
                action={async () => {
                  await deleteMomentAction(moment.id);
                }}
              >
                <button className="btn-3d" type="submit">
                  删除
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
