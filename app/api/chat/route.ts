import {
    convertToModelMessages,
    createUIMessageStreamResponse,
    streamText,
    toUIMessageStream,
  } from "ai";
import { openai } from "@ai-sdk/openai";


export const maxDuration = 60;

export async function POST(req:Request) {

    const {messages} = await req.json();

    const result = streamText({
        model: openai("gpt-5.4"),
        messages: await convertToModelMessages(messages),
    });


    return createUIMessageStreamResponse({
        stream:toUIMessageStream({stream:result.stream})
    })

}