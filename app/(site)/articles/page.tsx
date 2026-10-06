import { getArticles } from "@/lib/queries";
import Link from "next/link";

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <div>
      <h2 className="site-title text-2xl">文章</h2>
      <p className="mb-3 text-xs">日记、心情、半夜写给自己的话。</p>
      {articles.length ? (
        <ul className="space-y-2">
          {articles.map((article) => (
            <li className="guestbook-card diary-row" key={article.id}>
              <div className="pixel text-[10px] text-pink-700">
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString("zh-TW")
                  : "草稿"}
              </div>
              <div>
                <Link href={`/articles/${article.slug}`} className="font-bold">
                  {article.title}
                </Link>
                <p className="text-[11px]">分类：日记</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>还没有文章。</p>
      )}
    </div>
  );
}
