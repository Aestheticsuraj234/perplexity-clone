import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireAuth } from "@/modules/auth/actions";
import { Thread } from "@/modules/chat/thread";
import  db  from "@/drizzle/index";
import { chat, message } from "@/drizzle/schemas/chat-schema";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();

  const found = await db.select().from(chat).where(eq(chat.id, id));
  if (found.length > 0 && found[0].userId !== user.id) {
    redirect("/");
  }

  const rows = await db
    .select()
    .from(message)
    .where(eq(message.chatId, id))
    .orderBy(asc(message.createdAt));

  const initialMessages = [];
  for (const row of rows) {
    const parts = [];
    if (row.sources) {
      for (const source of JSON.parse(row.sources)) {
        parts.push({
          type: "source-url",
          sourceId: source.sourceId,
          url: source.url,
          title: source.title,
        });
      }
    }
    if (row.content) parts.push({ type: "text", text: row.content });
    if (row.imageUrl) {
      parts.push({ type: "file", mediaType: "image/png", url: row.imageUrl });
    }
    if (row.followUps) {
      parts.push({
        type: "data-follow-ups",
        data: { questions: JSON.parse(row.followUps) },
      });
    }
    initialMessages.push({
      id: row.id,
      role: row.role === "user" ? "user" : "assistant",
      parts,
    });
  }

  return <Thread key={id} chatId={id} initialMessages={initialMessages as any} />;
}
