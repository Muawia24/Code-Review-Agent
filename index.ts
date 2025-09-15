import { stepCountIs, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./prompts";
import { getChangesInDirectoryTool } from "./tools";


const CodeReviewAgent = async (prompt: string) => {
    const result = await streamText({
        model: google("models/gemini-2.5-flash"),
        prompt,
        system: SYSTEM_PROMPT,
        tools: {
            getChangesInDirectory: getChangesInDirectoryTool,
        },
        stopWhen: stepCountIs(10),
    });

    for await (const chunk of result.textStream){
        process.stdout.write(chunk);
    }
    
}

await CodeReviewAgent("Review the code changes in '../my-agent' directory, make your reviews and suggestions file by file");