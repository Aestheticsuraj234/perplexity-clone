"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar({ chats }: { chats: { id: string; title: string }[] }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r">
      <div className="p-3">
        <Link href="/" className="block border px-3 py-2 text-center text-sm">
          New
        </Link>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-1 px-2 pb-3">
          {chats.map((item) => (
            <Link
              key={item.id}
              href={`/chat/${item.id}`}
              className={
                pathname === `/chat/${item.id}`
                  ? "bg-muted px-3 py-2 text-sm"
                  : "px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              }
            >
              {item.title}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
