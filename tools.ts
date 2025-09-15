import { tool, generateText } from "ai";
import { simpleGit } from "simple-git";
import { z } from "zod";
import { google } from "@ai-sdk/google";

const excludeFiles = ["dist", "bun.lock"]
const fileChange = z.object({
    rootDir: z.string().min(1).describe("The root directory"),
});

type FileChange = z.infer<typeof fileChange>;

async function getChangesInDirectory({ rootDir }: FileChange) {
    const git = simpleGit(rootDir);
    const summary = await git.diffSummary();
    const diffs : { file: string, diff: string }[] = [];

    for (const file of summary.files) {
        if (excludeFiles.includes(file.file)) continue;
        const diff = await git.diff(["--", file.file]);
        diffs.push({ file: file.file, diff });
    }
    return diffs;
};

async function generateCommitMessage({ rootDir }: FileChange) {
    const diffs = await getChangesInDirectory({rootDir});
    if (!diffs.length) {
        return "No changes detected — nothing to commit.";
    }
    const diffText = diffs
      .map((d) => `File: ${d.file} \n ${d.diff}`)
      .join("\n\n");

    const prompt = `
    You are a commit message generator.
    Rules:
    - Use Conventional Commits style (feat, fix, chore, docs, refactor, test, etc.).
    - Subject line must be <= 72 characters.
    - Add a short body only if it adds value.
    - Do not include file paths in the subject.

    Here are the changes:
    ${diffText}
    `;
    const commitMsg = await generateText({
        model: google("models/gemini-2.5-flash"),
        prompt,
    })

    return commitMsg.text;
}


export const getChangesInDirectoryTool = tool({
    description: "Get the git diffs for all changed files in a directory",
    inputSchema: fileChange,
    execute: getChangesInDirectory,
});

export const generateCommitMessageTool = tool({
    description: "Generate a commit message from git diffs",
    inputSchema: fileChange,
    execute: generateCommitMessage,

});