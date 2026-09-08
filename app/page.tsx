import { requireAuth } from "@/modules/auth/actions";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Thread } from "@/modules/chat/thread";
import { ModeToggle } from "@/components/mode-toggle";


export default async function Home() {
  const user = await requireAuth();


  return (
    <div className="flex flex-1 flex-col">
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
    <Thread />
  </div>
  );
}
