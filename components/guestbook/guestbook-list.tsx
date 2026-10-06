import { ReplyForm } from "@/components/admin/reply-form";
import { deleteGuestbookAction } from "@/lib/actions";
import type { GuestbookMessage } from "@/types/database";

export function GuestbookList({
  messages,
  manage = false,
}: {
  messages: GuestbookMessage[];
  manage?: boolean;
}) {
  if (!messages.length) {
    return <p className="text-sm">还没有人来过…你要当第一个吗？</p>;
  }
  return (
    <div>
      {messages.map((msg, index) => (
        <article className="guestbook-card" key={msg.id}>
          <div className="gb-head">
            <span>No.{String(messages.length - index).padStart(3, "0")}</span>
            <time>{new Date(msg.created_at).toLocaleString("zh-TW")}</time>
          </div>
          <p className="font-bold">{msg.nickname}</p>
          <p className="whitespace-pre-wrap">{msg.body}</p>
          {manage ? (
            <form action={deleteGuestbookAction.bind(null, msg.id)}>
              <button className="btn-3d" type="submit">
                删除
              </button>
            </form>
          ) : null}
          {manage ? <ReplyForm parentId={msg.id} /> : null}
          {msg.replies.map((reply) => (
            <div className="reply-card" key={reply.id}>
              <p className="font-bold">{reply.nickname}</p>
              <p className="whitespace-pre-wrap">{reply.body}</p>
              {manage ? (
                <form action={deleteGuestbookAction.bind(null, reply.id)}>
                  <button className="btn-3d" type="submit">
                    删除
                  </button>
                </form>
              ) : null}
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}
