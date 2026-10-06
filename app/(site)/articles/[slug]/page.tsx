import { getArticleBySlug } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  return (
    <article>
      <p className="mb-2 text-xs">
        <Link href="/articles">« 回文章列表</Link>
      </p>
      <h2 className="site-title mb-2 text-3xl">{article.title}</h2>
      <p className="mb-3 text-[11px]">
        {article.published_at ? new Date(article.published_at).toLocaleString("zh-TW") : ""}
      </p>
      {article.cover_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.cover_url} alt="" className="photo-tile mb-3 max-h-64" />
      ) : null}
      <div className="whitespace-pre-wrap text-sm leading-7">{article.body}</div>
    </article>
  );
}
