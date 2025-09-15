import { tool } from "ai";
import { simpleGit } from "simple-git";
import { z } from "zod";

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


export const getChangesInDirectoryTool = tool({
    description: "Get the git diffs for all changed files in a directory",
    inputSchema: fileChange,
    execute: getChangesInDirectory,
});