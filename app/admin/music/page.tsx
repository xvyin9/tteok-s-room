import { deleteTrackAction, saveTrackAction } from "@/lib/actions";
import { getTracks } from "@/lib/queries";

export default async function MusicAdminPage() {
  const tracks = await getTracks(true);
  return (
    <div>
      <h2 className="site-title mb-3 text-xl">BGM 外链</h2>
      <p className="mb-3 text-xs">
        贴可以直接播放的 mp3 / audio URL（例如自己的网盘直链）。请注意版权。
      </p>
      <form
        className="widget"
        action={async (formData) => {
          await saveTrackAction(formData);
        }}
      >
        <div className="widget-title">加一首</div>
        <div className="widget-body space-y-2">
          <input className="field" name="title" placeholder="歌名" required />
          <input className="field" name="external_url" placeholder="https://...mp3" required />
          <input className="field" name="sort_order" type="number" defaultValue={0} />
          <label className="text-xs">
            <input type="checkbox" name="is_active" defaultChecked /> 播放
          </label>
          <div>
            <button className="btn-3d" type="submit">
              加入播放器
            </button>
          </div>
        </div>
      </form>
      <table className="admin-table mt-3">
        <thead>
          <tr>
            <th>歌名</th>
            <th>链接</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <tr key={track.id}>
              <td>
                {track.title}
                {track.is_active ? "" : "（关）"}
              </td>
              <td className="break-all text-[11px]">{track.external_url}</td>
              <td>
                <form
                  action={async () => {
                    await deleteTrackAction(track.id);
                  }}
                >
                  <button className="btn-3d" type="submit">
                    删除
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
