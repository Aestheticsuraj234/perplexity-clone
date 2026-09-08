import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  generateId,
  generateText,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { tavily } from "@tavily/core";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import db from "@/drizzle/index";
import { chat, message } from "@/drizzle/schemas/chat-schema";
import { DEFAULT_CHAT_MODEL, type ChatMode } from "@/lib/models";

export const maxDuration = 60;

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function POST(req: Request) {
  const {
    messages,
    id,
    mode = "search",
    model = DEFAULT_CHAT_MODEL,
  }: {
    messages: Parameters<typeof convertToModelMessages>[0];
    id: string;
    mode?: ChatMode;
    model?: string;
  } = await req.json();

  const session = await auth.api.getSession({ headers: await headers() });

  const stream = createUIMessageStream({
    async execute({ writer }) {
      const assistantId = generateId();
      writer.write({ type: "start", messageId: assistantId });

      const userMsg = messages[messages.length - 1];

      let question = "";

      for (const part of userMsg.parts) {
        if (part.type === "text") question = part.text;
      }

      const sourceList: { sourceId: string; url: string; title: string }[] = [];
      let instructions: string | undefined;

      if (mode === "search") {
        const tavilyResult = await tvly.search(question, { maxResults: 5 });
        const sources = tavilyResult.results;
        let sourceText = "";

        for (let i = 0; i < sources.length; i++) {
          writer.write({
            type: "source-url",
            sourceId: String(i + 1),
            url: sources[i].url,
            title: sources[i].title,
          });
          sourceList.push({
            sourceId: String(i + 1),
            url: sources[i].url,
            title: sources[i].title,
          });

          sourceText += `[${i + 1}] ${sources[i].title}\n${sources[i].url}\n${sources[i].content}\n\n`;
        }

        instructions = `Answer using these sources. Cite like [1].\n\n${sourceText}`;
      }

      const result = streamText({
        model: openai(model),
        instructions,
        messages: await convertToModelMessages(messages),
      });

      writer.merge(
        toUIMessageStream({
          stream: result.stream,
          sendStart: false,
          sendFinish: false,
        }),
      );

      const answer = await result.text;

      const followUp = await generateText({
        model: openai(model),
        instructions:
          "Reply with exactly 3 short follow-up questions, one per line. No numbers, no extra text.",
        prompt: `The user asked: ${question}\n\nYour answer was:\n${answer}`,
      });

      const questions = [];
      for (const line of followUp.text.split("\n")) {
        if (line.trim()) questions.push(line.trim());
      }

      writer.write({
        type: "data-follow-ups",
        data: { questions },
      });

      // @ts-ignore
      const existing = await db.select().from(chat).where(eq(chat.id, id));
      if (existing.length === 0) {
        await db.insert(chat).values({
          id,
          userId: session!.user.id,
          title: question.slice(0, 50),
        });
      }

      const userMessageId =
        "id" in userMsg && typeof userMsg.id === "string"
          ? userMsg.id
          : generateId();

      await db.insert(message).values({
        id: userMessageId,
        chatId: id,
        role: "user",
        content: question,
      });

      await db.insert(message).values({
        id: assistantId,
        chatId: id,
        role: "assistant",
        content: answer,
        sources: JSON.stringify(sourceList),
        followUps: JSON.stringify(questions),
      });

      writer.write({ type: "finish" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
