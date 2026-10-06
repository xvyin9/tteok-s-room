import { getArticles, getGuestbook, getMoments, getPhotos } from "@/lib/queries";
import Link from "next/link";

export default async function AdminHomePage() {
  const [photos, moments, articles, guestbook] = await Promise.all([
    getPhotos(true),
    getMoments(true),
    getArticles(true),
    getGuestbook(true),
  ]);
  return (
    <div>
      <h2 className="site-title text-xl">今日小窝</h2>
      <table className="admin-table mt-3">
        <tbody>
          <tr>
            <th>照片</th>
            <td>{photos.length} 张</td>
          </tr>
          <tr>
            <th>动态</th>
            <td>{moments.length} 条</td>
          </tr>
          <tr>
            <th>文章</th>
            <td>{articles.length} 篇</td>
          </tr>
          <tr>
            <th>留言</th>
            <td>{guestbook.length} 条</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-sm">
        从上面的分页进去：上传照片、发动态、写文章、回留言、贴 BGM 外链。
      </p>
      <p className="mt-2 text-xs">
        还没接数据库的话，先看 <code>.env.example</code> 和{" "}
        <code>supabase/migrations/001_init.sql</code>。
      </p>
      <p className="mt-2">
        <Link href="/admin/guestbook">先去回留言 »</Link>
      </p>
    </div>
  );
}
