import { ReplyForm } from "@/components/admin/reply-form";
import { hideGuestbookAction } from "@/lib/actions";
import { getGuestbook } from "@/lib/queries";

export default async function GuestbookAdminPage() {
  const messages = await getGuestbook(true);
  return (
    <div>
      <h2 className="site-title mb-3 text-xl">留言管理</h2>
      {messages.map((msg) => (
        <article className="guestbook-card" key={msg.id}>
          <div className="flex justify-between text-[11px]">
            <strong>
              {msg.nickname}
              {msg.is_hidden ? " · 已隐藏" : ""}
            </strong>
            <time>{new Date(msg.created_at).toLocaleString("zh-TW")}</time>
          </div>
          <p className="whitespace-pre-wrap text-sm">{msg.body}</p>
          {msg.replies.map((reply) => (
            <div className="reply-card" key={reply.id}>
              <strong>{reply.nickname}</strong>
              <p>{reply.body}</p>
            </div>
          ))}
          <ReplyForm parentId={msg.id} />
          <form className="mt-1" action={hideGuestbookAction.bind(null, msg.id, !msg.is_hidden)}>
            <button className="btn-3d" type="submit">
              {msg.is_hidden ? "显示" : "隐藏"}
            </button>
          </form>
        </article>
      ))}
    </div>
  );
}
