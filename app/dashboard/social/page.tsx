import { deleteExtraSocialAction, saveSocialsAction } from "@/lib/actions";
import { getSettings } from "@/lib/queries";

export default async function SocialPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-3">
      <form className="widget" action={saveSocialsAction}>
        <div className="widget-title">社交账号</div>
        <div className="widget-body space-y-2">
          <label className="block text-xs">
            Instagram
            <input className="field mt-1" name="instagram_url" defaultValue={settings.instagram_url ?? ""} />
          </label>
          <label className="block text-xs">
            X
            <input className="field mt-1" name="x_url" defaultValue={settings.x_url ?? ""} />
          </label>
          <label className="block text-xs">
            TikTok
            <input className="field mt-1" name="tiktok_url" defaultValue={settings.tiktok_url ?? ""} />
          </label>
          <label className="block text-xs">
            YouTube
            <input className="field mt-1" name="youtube_url" defaultValue={settings.youtube_url ?? ""} />
          </label>
          <p className="text-xs">再加一个</p>
          <input className="field" name="extra_label" placeholder="名字，比如微博" />
          <input className="field" name="extra_url" placeholder="https://" />
          <button className="btn-3d" type="submit">
            保存链接
          </button>
        </div>
      </form>
      {settings.other_socials.map((item) => (
        <form key={item.id} action={deleteExtraSocialAction.bind(null, item.id)} className="widget">
          <div className="widget-body flex items-center justify-between gap-2">
            <span>
              {item.label} · {item.url}
            </span>
            <button className="btn-3d" type="submit">
              删除
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}
