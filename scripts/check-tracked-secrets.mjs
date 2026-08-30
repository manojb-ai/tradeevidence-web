import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repositoryRoot = process.cwd();
const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  cwd: repositoryRoot,
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);

const forbiddenNames = [
  /^\.env(?:\..+)?$/u,
  /(?:^|[._-])credentials?(?:[._-]|$)/iu,
  /\.(?:key|p12|pfx|pem)$/iu,
];
const allowedNames = new Set([".env.example"]);
const secretPatterns = [
  {
    name: "private key",
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/u,
  },
  { name: "AWS access key", pattern: /\bAKIA[A-Z0-9]{16}\b/u },
  {
    name: "GitHub access token",
    pattern: /\bgh[oprsu]_[A-Za-z0-9_]{30,}\b/u,
  },
  {
    name: "OpenAI-style secret key",
    pattern: /\bsk-[A-Za-z0-9_-]{32,}\b/u,
  },
];
const findings = [];

for (const trackedFile of trackedFiles) {
  const basename = path.basename(trackedFile);

  if (
    !allowedNames.has(basename) &&
    forbiddenNames.some((pattern) => pattern.test(basename))
  ) {
    findings.push(`${trackedFile}: forbidden secret-bearing filename`);
    continue;
  }

  const content = readFileSync(path.join(repositoryRoot, trackedFile));
  if (content.includes(0)) {
    continue;
  }

  const textContent = content.toString("utf8");
  for (const { name, pattern } of secretPatterns) {
    if (pattern.test(textContent)) {
      findings.push(`${trackedFile}: possible ${name}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Potential secrets found in tracked files:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  console.error(
    "Only file names and finding categories are shown; secret values are never printed.",
  );
  process.exitCode = 1;
} else {
  console.log(
    `Checked ${trackedFiles.length} tracked files: no baseline secret patterns found.`,
  );
}
