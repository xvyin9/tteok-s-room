import { getArticleBySlug } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

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
      <h2 className="site-title text-2xl">{article.title}</h2>
      <p className="mb-3 text-[11px]">
        {article.published_at
          ? new Date(article.published_at).toLocaleString("zh-TW")
          : ""}
      </p>
      {article.cover_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.cover_url} alt="" className="photo-tile mb-3 max-h-64" />
      ) : null}
      <div className="prose-room text-sm leading-7 [&_a]:underline [&_h3]:mt-3 [&_p]:mb-3">
        <Markdown>{article.body}</Markdown>
      </div>
    </article>
  );
}
