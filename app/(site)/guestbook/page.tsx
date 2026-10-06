import { GuestbookForm } from "@/components/guestbook/guestbook-form";
import { GuestbookList } from "@/components/guestbook/guestbook-list";
import { getGuestbook } from "@/lib/queries";

export default async function GuestbookPage() {
  const messages = await getGuestbook();
  return (
    <div>
      <h2 className="site-title text-2xl">留言板</h2>
      <p className="mb-3 text-xs">不用登录。留下昵称就可以说话。</p>
      <GuestbookForm />
      <hr className="dot" />
      <GuestbookList messages={messages} />
    </div>
  );
}
