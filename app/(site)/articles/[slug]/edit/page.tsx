import { getArticles } from "@/lib/queries";
import { redirect } from "next/navigation";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles(true);
  const article = articles.find((item) => item.slug === slug);
  if (!article) redirect("/dashboard/articles");
  redirect(`/dashboard/articles/${article.id}`);
}
