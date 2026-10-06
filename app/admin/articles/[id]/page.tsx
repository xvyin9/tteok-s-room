import { ArticleForm } from "@/components/admin/article-form";
import { getArticles } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articles = await getArticles(true);
  const article = articles.find((item) => item.id === id);
  if (!article) notFound();

  return (
    <div>
      <p className="mb-2 text-xs">
        <Link href="/admin/articles">« 回文章列表</Link>
      </p>
      <h2 className="site-title mb-3 text-xl">修改文章</h2>
      <ArticleForm article={article} />
    </div>
  );
}
