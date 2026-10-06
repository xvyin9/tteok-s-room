import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="hompy-frame p-6">
        <p className="pixel blink text-[10px]">404</p>
        <h1 className="site-title mt-2 text-3xl">走错房间了</h1>
        <p className="mt-2 text-sm">这页不存在，回小窝吧。</p>
        <Link className="btn-3d mt-4 inline-block" href="/home">
          回小窝
        </Link>
      </div>
    </div>
  );
}
