import fs from 'fs';
import path from 'path';

/**
 * Normalize path by converting backslashes to forward slashes
 * @param filePath - Path to normalize
 * @returns Normalized path with forward slashes
 */
export function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

/**
 * Get all markdown and notebook files recursively from a directory
 * @param dir - Directory path to search
 * @returns Array of relative file paths
 */
export function getMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  function traverse(currentDir: string, baseDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath, baseDir);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (ext === '.md' || ext === '.ipynb') {
          const relativePath = path.relative(baseDir, fullPath);
          files.push(relativePath);
        }
      }
    }
  }

  traverse(dir, dir);
  return files;
}
