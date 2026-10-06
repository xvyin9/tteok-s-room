"use client";

import { saveArticleAction } from "@/lib/actions";
import { STORAGE_BUCKETS } from "@/lib/config";
import { uploadToBucket } from "@/lib/upload";
import { DateFields } from "@/components/edit/date-fields";
import type { Article } from "@/types/database";
import { useState } from "react";

export function ArticleForm({ article }: { article?: Article }) {
  const [coverPath, setCoverPath] = useState(article?.cover_path ?? "");
  const [status, setStatus] = useState<string | null>(null);

  return (
    <form
      className="space-y-2"
      action={async (formData) => {
        formData.set("cover_path", coverPath);
        if (article) formData.set("id", article.id);
        const result = await saveArticleAction(formData);
        setStatus(result.error ?? "存好了");
      }}
    >
      <label className="block text-xs">
        标题
        <input className="field mt-1" name="title" defaultValue={article?.title ?? ""} required />
      </label>
      <label className="block text-xs">
        正文（Markdown）
        <textarea className="field mt-1 h-48" name="body" defaultValue={article?.body ?? ""} />
      </label>
      <DateFields value={article?.published_at ?? article?.created_at} label="发布日期和时间" />
      <label className="block text-xs">
        封面
        <input
          className="field mt-1"
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const uploaded = await uploadToBucket(STORAGE_BUCKETS.articleCovers, file);
            setCoverPath(uploaded.path);
          }}
        />
      </label>
      <label className="text-xs">
        <input type="checkbox" name="is_published" defaultChecked={article ? article.is_published : true} /> 发布到前台
      </label>
      <div>
        <button className="btn-3d" type="submit">
          保存文章
        </button>
      </div>
      {status ? <p className="text-xs">{status}</p> : null}
    </form>
  );
}
