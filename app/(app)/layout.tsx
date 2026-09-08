import type { ReactNode } from "react";
import { requireAuth } from "@/modules/auth/actions";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { Sidebar } from "@/modules/chat/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import  db  from "@/drizzle/index";
import { chat } from "@/drizzle/schemas/chat-schema";
import { desc, eq } from "drizzle-orm";
import { ModeToggle } from "@/components/mode-toggle";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireAuth();


  const chats = await db
    .select()
    .from(chat)
    // @ts-ignore
    .where(eq(chat.userId, user.id))
    // @ts-ignore
    .orderBy(desc(chat.createdAt));

  return (
    <div className="flex min-h-0 flex-1">
      <Sidebar chats={chats} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-3">
          <p className="font-heading text-lg font-semibold">Perplexity</p>
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">{user.name}</p>
            <SignOutButton />
            <ModeToggle/>
          </div>
        </header>
        <Separator />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
