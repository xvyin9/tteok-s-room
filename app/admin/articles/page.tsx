import { ArticleForm } from "@/components/admin/article-form";
import { deleteArticleAction } from "@/lib/actions";
import { getArticles } from "@/lib/queries";
import Link from "next/link";

export default async function ArticlesAdminPage() {
  const articles = await getArticles(true);
  return (
    <div>
      <h2 className="site-title mb-3 text-xl">写文章</h2>
      <ArticleForm />
      <hr className="dot" />
      <h3 className="mb-2 text-sm font-bold">已有文章</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.is_published ? "已发布" : "草稿"}</td>
              <td>
                <Link className="btn-3d" href={`/admin/articles/${article.id}`}>
                  修改
                </Link>
                <form
                  className="mt-1"
                  action={async () => {
                    await deleteArticleAction(article.id);
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
