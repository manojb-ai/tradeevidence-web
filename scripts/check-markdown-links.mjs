import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repositoryRoot = process.cwd();
const markdownFiles = [
  path.join(repositoryRoot, "README.md"),
  ...findMarkdownFiles(path.join(repositoryRoot, "docs")),
  ...findMarkdownFiles(path.join(repositoryRoot, "analytics-engine")),
];
const missingLinks = [];

for (const markdownFile of markdownFiles) {
  const content = readFileSync(markdownFile, "utf8");
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;

  for (const match of content.matchAll(linkPattern)) {
    const rawTarget = match[1].trim().split(/\s+"/u, 1)[0];

    if (shouldSkip(rawTarget)) {
      continue;
    }

    const targetWithoutAnchor = rawTarget.split("#", 1)[0];
    const decodedTarget = decodeURIComponent(
      targetWithoutAnchor.replace(/^<|>$/gu, ""),
    );
    const resolvedTarget = path.resolve(
      path.dirname(markdownFile),
      decodedTarget,
    );

    if (!existsSync(resolvedTarget)) {
      missingLinks.push(
        `${path.relative(repositoryRoot, markdownFile)} -> ${rawTarget}`,
      );
    }
  }
}

if (missingLinks.length > 0) {
  console.error("Broken local Markdown links:");
  for (const missingLink of missingLinks) {
    console.error(`- ${missingLink}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Checked ${markdownFiles.length} Markdown files: all local links resolve.`,
  );
}

function findMarkdownFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (
        ["input", "output", "node_modules", "__pycache__"].includes(entry.name)
      ) {
        return [];
      }
      return findMarkdownFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function shouldSkip(target) {
  return (
    target === "" ||
    target.startsWith("#") ||
    target.startsWith("/") ||
    /^[a-z][a-z\d+.-]*:/iu.test(target)
  );
}
