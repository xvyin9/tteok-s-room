import type { GuestbookMessage } from "@/types/database";

export function GuestbookList({ messages }: { messages: GuestbookMessage[] }) {
  if (!messages.length) {
    return <p className="text-sm">还没有人来过…你要当第一个吗？</p>;
  }
  return (
    <div>
      {messages.map((msg, index) => (
        <article className="guestbook-card" key={msg.id}>
          <div className="flex justify-between text-[11px]">
            <strong>
              No.{String(messages.length - index).padStart(3, "0")} {msg.nickname}
            </strong>
            <time>{new Date(msg.created_at).toLocaleString("zh-TW")}</time>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-sm">{msg.body}</p>
          {msg.replies.map((reply) => (
            <div className="reply-card" key={reply.id}>
              <div className="text-[11px] font-bold">★ {reply.nickname} 回复</div>
              <p className="whitespace-pre-wrap text-sm">{reply.body}</p>
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}
