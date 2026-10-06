import { ArticleForm } from "@/components/admin/article-form";
import { deleteArticleAction } from "@/lib/actions";
import { getArticles } from "@/lib/queries";
import Link from "next/link";

export default async function ArticlesDashboardPage() {
  const articles = await getArticles(true);
  return (
    <div className="space-y-3">
      <div className="widget">
        <div className="widget-title">新文章</div>
        <div className="widget-body">
          <ArticleForm />
        </div>
      </div>
      {articles.map((article) => (
        <article className="widget" key={article.id}>
          <div className="widget-body flex items-center justify-between gap-2">
            <div>
              <Link className="font-bold" href={`/dashboard/articles/${article.id}`}>
                {article.title}
              </Link>
              <p className="text-[11px]">{article.is_published ? "已发布" : "草稿"}</p>
            </div>
            <form action={deleteArticleAction.bind(null, article.id)}>
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
