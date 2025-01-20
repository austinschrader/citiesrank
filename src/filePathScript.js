import { promises as fs } from "fs";
import { minimatch } from "minimatch";
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
  "tsconfig.app.json",
  "tsconfig.node.json",
  "tsconfig.node.tsbuildinfo",
  "tsconfig.tsbuildinfo",
  "vite.config.d.ts",
  "vite.config.js",
  "vite.config.ts",
  "**/.DS_Store",
  "src/lib/.env.example",
  "src/filePathScript.js",
  "src/config/appConfig.d.ts",
  "src/config/appConfig.js",
  "src/config/appConfig.ts",
  "src/config/GoogleAnalytics.tsx",
  "src/lib/data/**", // This will ignore everything under src/lib/data
];

async function listFiles(startPath) {
  const results = [];

  async function scan(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);
      const relativePath = relative(startPath, fullPath);

      // Check if path matches any glob pattern in ignoreList
      const shouldIgnore = ignoreList.some((pattern) => {
        return minimatch(relativePath, pattern, { dot: true });
      });

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
