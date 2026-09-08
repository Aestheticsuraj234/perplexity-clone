import {generateImage} from "ai";
import {openai} from "@ai-sdk/openai";
import { exportPages } from "next/dist/export/worker";


export const maxDuration = 60;

export async function POST(req:Request){
    const {prompt} = await req.json();

    const {image} = await generateImage({
        model:openai.image("gpt-image-2"),
        prompt
    });

    return Response.json({
         url: `data:${image.mediaType};base64,${image.base64}`,
    })
}