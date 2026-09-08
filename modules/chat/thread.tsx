"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Streamdown } from "streamdown";
import { SearchBox } from "./search-box";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sources } from "./sources";
import { FollowUps } from "./follow-ups";

import { useRouter } from "next/navigation";


export function Thread({
  chatId,
  initialMessages,
}: {
  chatId: string;
  initialMessages: UIMessage[];
}){
const [mode, setMode] = useState("search");
const router = useRouter();
const [imageBusy, setImageBusy] = useState(false);
const { messages, sendMessage, setMessages , status } = useChat({
  id:chatId,
  messages:initialMessages,
  onFinish(){
    router.refresh();
  }
});

async function onSubmit(text: string) {
  if (mode === "image") {
    setImageBusy(true);
    const response = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });
    const data = await response.json();
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text }],
      },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        parts: [{ type: "file", mediaType: "image/png", url: data.url }],
      },
    ]);
    setImageBusy(false);
    return;
  }

  sendMessage({ text });
}
  if (messages.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>What do you want to know?</EmptyTitle>
          <EmptyDescription>
            Ask a question and the answer will stream in.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="max-w-2xl">
          <SearchBox
            mode={mode}
            setMode={setMode}
            onSubmit={onSubmit}
            busy={status !== "ready"}
          />
        </EmptyContent>
      </Empty>
    );
  }


  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="flex-1">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
          {messages.map((message) =>
            message.role === "user" ? (
              <Card key={message.id} size="sm">
                <CardHeader>
                  <CardTitle className="normal-case tracking-normal">
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return <span key={`${message.id}-${i}`}>{part.text}</span>;
                      }
                    })}
                  </CardTitle>
                </CardHeader>
              </Card>
            ) : (
              <Card key={message.id} size="sm">
                <CardContent>
                  <Sources parts={message.parts} />
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Streamdown key={`${message.id}-${i}`}>
                            {part.text}
                          </Streamdown>
                        );
                      case "file":
                        return (
                          <img
                            key={`${message.id}-${i}`}
                            src={part.url}
                            alt=""
                            className="w-full"
                          />
                        );
                    }
                  })}
                  <FollowUps
                    parts={message.parts}
                    onPick={(text) => sendMessage({ text })}
                    busy={status !== "ready" || imageBusy}
                  />
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </ScrollArea>
      <div className="mx-auto w-full max-w-2xl px-4 pb-6">
        <SearchBox
          mode={mode}
          setMode={setMode}
          onSubmit={onSubmit}
          busy={status !== "ready" || imageBusy}
        />
      </div>
    </div>
  );
}