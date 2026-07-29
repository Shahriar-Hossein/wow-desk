import { Workspace } from "@/app/components/workspace";
import { seedConversations } from "@/app/lib/seed";

export default function Home() {
  return <Workspace initialConversations={seedConversations} />;
}
