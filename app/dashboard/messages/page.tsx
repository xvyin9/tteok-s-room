import { GuestbookList } from "@/components/guestbook/guestbook-list";
import { getGuestbook } from "@/lib/queries";

export default async function MessagesPage() {
  const messages = await getGuestbook(true);
  return (
    <div className="widget">
      <div className="widget-title">留言</div>
      <div className="widget-body">
        <GuestbookList messages={messages} manage />
      </div>
    </div>
  );
}
