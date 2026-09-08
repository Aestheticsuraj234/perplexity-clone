import {generateImage} from "ai";
import {openai} from "@ai-sdk/openai";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import  db  from "@/drizzle/index";
import { chat, message } from "@/drizzle/schemas/chat-schema";

export const maxDuration = 60;

export async function POST(req:Request){
    const {prompt , id} = await req.json();
    const session = await auth.api.getSession({ headers: await headers() });

    const {image} = await generateImage({
        model:openai.image("gpt-image-2"),
        prompt
    });

    const url = `data:${image.mediaType};base64,${image.base64}`;

    // @ts-ignore
    const existing = await db.select().from(chat).where(eq(chat.id, id));
    if (existing.length === 0) {
      await db.insert(chat).values({
        id,
        userId: session!.user.id,
        title: prompt.slice(0, 50),
      });
    }


  await db.insert(message).values({
    id: crypto.randomUUID(),
    chatId: id,
    role: "user",
    content: prompt,
  });
  await db.insert(message).values({
    id: crypto.randomUUID(),
    chatId: id,
    role: "assistant",
    imageUrl: url,
  });


    return Response.json({url})
}