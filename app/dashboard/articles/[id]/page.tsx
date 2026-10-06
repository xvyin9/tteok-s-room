import { ArticleForm } from "@/components/admin/article-form";
import { getArticleById } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditDashboardArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();
  return (
    <div>
      <p className="mb-2 text-xs">
        <Link href="/dashboard/articles">« 回文章</Link>
      </p>
      <div className="widget">
        <div className="widget-title">编辑文章</div>
        <div className="widget-body">
          <ArticleForm article={article} />
        </div>
      </div>
    </div>
  );
}
