import { tool, generateText } from "ai";
import { simpleGit } from "simple-git";
import { z } from "zod";
import { google } from "@ai-sdk/google";

const excludeFiles = ["dist", "bun.lock"]
const fileChange = z.object({
    rootDir: z.string().min(1).describe("The root directory"),
});

const markdownFileSchema = z.object({
  content: z.string().describe("The Markdown text to write"),
  filename: z.string().optional().default("REVIEW.md").describe("Optional filename (default: REVIEW.md)"),
  append: z.boolean().optional().default(false).describe("Whether to append to the file instead of overwriting (default: false)")
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

async function generateMarkdownFile({ 
    content,
    filename = "REVIEW.md",
    append = false
}: {
    content: string;
    filename?: string;
    append?: boolean;
}){
    const fs = await import("fs");
    const path = await import("path");

    const filePath = path.resolve(process.cwd(), filename);

    if (append) {
        fs.appendFileSync(filePath, "\n" + content, "utf-8");
    } else {
        fs.writeFileSync(filePath, content, "utf-8");
    }

    // ✅ Return something (not void)
    return { message: `Markdown written to ${filePath}`, path: filePath };
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

export const generateMarkdownFileTool = tool({
  description: "Write Markdown content into a file for reviews, commit notes, or PR descriptions.",
  inputSchema: markdownFileSchema,
  execute: generateMarkdownFile
});