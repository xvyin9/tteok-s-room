import { deleteTrackAction, saveTrackAction } from "@/lib/actions";
import { getTracks } from "@/lib/queries";

export default async function MusicPage() {
  const tracks = await getTracks(true);
  return (
    <div className="space-y-3">
      <form className="widget" action={saveTrackAction}>
        <div className="widget-title">加入歌曲</div>
        <div className="widget-body space-y-2">
          <input className="field" name="title" placeholder="歌名" required />
          <input className="field" name="external_url" placeholder="https://...mp3" required />
          <input className="field" name="sort_order" type="number" defaultValue={tracks.length} />
          <label className="text-xs">
            <input type="checkbox" name="is_active" defaultChecked /> 放进播放器
          </label>
          <button className="btn-3d" type="submit">
            添加
          </button>
        </div>
      </form>
      {tracks.map((track) => (
        <form key={track.id} className="widget" action={saveTrackAction}>
          <div className="widget-body space-y-2">
            <input type="hidden" name="id" value={track.id} />
            <input className="field" name="title" defaultValue={track.title} />
            <input className="field" name="external_url" defaultValue={track.external_url} />
            <input className="field" name="sort_order" type="number" defaultValue={track.sort_order} />
            <label className="text-xs">
              <input type="checkbox" name="is_active" defaultChecked={track.is_active} /> 播放
            </label>
            <button className="btn-3d" type="submit">
              保存
            </button>
          </div>
          <div className="px-2 pb-2">
            <button className="btn-3d" formAction={deleteTrackAction.bind(null, track.id)} type="submit">
              删除
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}
