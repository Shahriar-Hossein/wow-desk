import { Inbox } from "@/app/components/inbox";
import { seedConversations } from "@/app/lib/seed";

export default function Home() {
  return <Inbox initialConversations={seedConversations} />;
}
