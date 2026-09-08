import {
    convertToModelMessages,
    createUIMessageStream,
    createUIMessageStreamResponse,
    streamText,
    toUIMessageStream,
  } from "ai";
import { openai } from "@ai-sdk/openai";
import { tavily } from "@tavily/core";

export const maxDuration = 60;

const tvly = tavily({apiKey:process.env.TAVILY_API_KEY})

export async function POST(req:Request) {

    const {messages} = await req.json();

    const stream = createUIMessageStream({
        async execute({writer}){
            writer.write({type:"start"});

            let question = "";

            for(const part of messages[messages.length - 1].parts){
                if(part.type === "text") question = part.text;
            }

            const tavilyResult = await tvly.search(question , {maxResults:5})
            const sources = tavilyResult.results;
            let sourceText = "";

            for(let i=0; i<sources.length; i++){
                writer.write({
                    type:"source-url",
                    sourceId:String(i+1),
                    url:sources[i].url,
                    title:sources[i].title,
                   
                });
                sourceText += `[${i + 1}] ${sources[i].title}\n${sources[i].url}\n${sources[i].content}\n\n`;
      
            }

            const result = streamText({
                model: openai("gpt-5.4"),
                instructions: `Answer using these sources. Cite like [1].\n\n${sourceText}`,
                messages:await convertToModelMessages(messages),
            });

            writer.merge(
                toUIMessageStream({stream:result.stream , sendStart:false})
            )
        }
    });

    return createUIMessageStreamResponse({stream});

}