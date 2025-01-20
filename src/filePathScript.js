import { promises as fs } from "fs";
import { join, relative, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const ignoreList = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  "pocketbase",
  "historical-screenshots",
  "public",
  "src/components/ui",
  ".idea",
  ".vscode",
  ".github",
  "pnpm-lock.yaml",
  ".DS_Store",
  "*.test.ts",
  "*.test.tsx",
  "__tests__",
  "__snapshots__",
  "*.d.ts",
  "*.config.js",
  "*.config.ts",
  ".env*",
  ".eslintrc*",
  ".prettierrc*",
  "README.md",
  "LICENSE",
  "tsconfig.json",
  "jest.config.*",
  "*.css",
  "*.svg",
  "*.png",
  "*.jpg",
  "*.ico",
  ".env",
  ".gitignore",
  "components.json",
  "eslint.config.js",
  "index.html",
  "package-lock.json",
  "package.json",
  "rewrites.json",
  "src/.DS_Store",
  "src/assets",
  "src/lib/data",
  "src/files.txt",
  "src/pages/.DS_Store",
];

async function listFiles(startPath) {
  const results = [];

  async function scan(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);
      const relativePath = relative(startPath, fullPath);

      // Simpler ignore check: either exact match or is a subdirectory of ignored path
      const shouldIgnore = ignoreList.some(
        (ignorePath) =>
          relativePath === ignorePath ||
          relativePath.startsWith(ignorePath + "/")
      );

      if (shouldIgnore) {
        continue;
      }

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else {
        results.push(relativePath);
      }
    }
  }

  await scan(startPath);
  return results.sort(); // Sort for consistent output
}

async function main() {
  try {
    const repoPath = resolve(__dirname, "..");
    const files = await listFiles(repoPath);

    // Write to files.txt in the current directory
    await fs.writeFile("files.txt", files.join("\n"), "utf-8");

    console.log(`Found ${files.length} files. Written to files.txt`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
