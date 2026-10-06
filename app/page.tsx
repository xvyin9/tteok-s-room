import { EnterButton } from "@/components/enter-button";
import { getSettings } from "@/lib/queries";

export default async function EnterPage() {
  const settings = await getSettings();
  return (
    <div className="enter-gate">
      <div className="enter-card">
        <p className="pixel blink text-[10px] text-pink-600">PLEASE OPEN YOUR SPEAKER</p>
        <h1 className="site-title mt-3 text-4xl">{settings.site_title}</h1>
        <p className="mt-3 text-sm">这里是 {settings.owner_display_name} 的个人小窝</p>
        <p className="mt-1 text-xs">点击进入后会开始播放 BGM，并记一次到访。</p>
        <div className="mx-auto mt-4 h-16 w-16 rounded-full border-4 border-dashed border-pink-400 bg-pink-100 text-3xl leading-[56px]">
          ★
        </div>
        <EnterButton />
        <p className="mt-4 text-[11px] text-pink-700">最佳浏览环境：2008 年的夏天</p>
      </div>
    </div>
  );
}
