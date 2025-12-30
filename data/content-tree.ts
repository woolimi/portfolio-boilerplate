import { normalizePath } from '@/lib/file-utils';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export type TreeNode = {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: TreeNode[];
  slug?: string;
  locale?: string;
  title?: string;
};

/**
 * Get content folder structure as a tree
 * @param contentDir Content directory path
 * @param locale Filter by locale (only show files matching this locale)
 */
export function getContentTree(contentDir: string = 'content', locale: string = 'ko'): TreeNode[] {
  const fullPath = path.join(process.cwd(), contentDir);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  function buildTree(dir: string, relativePath: string = '', currentLocale?: string): TreeNode[] {
    const items: TreeNode[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryFullPath = path.join(dir, entry.name);
      const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        // Recursively build children with locale filter
        const children = buildTree(entryFullPath, itemPath, currentLocale);
        // Only include folder if it has children (after filtering by locale)
        if (children.length > 0) {
          items.push({
            name: entry.name,
            type: 'folder',
            path: itemPath,
            children,
          });
        }
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.ipynb'))) {
        // Parse filename to extract slug and locale
        // Pattern: [slug].[locale].md or [slug].md or [slug].[locale].ipynb or [slug].ipynb
        const ext = entry.name.endsWith('.ipynb') ? '.ipynb' : '.md';
        const fileName = path.basename(entry.name, ext);

        // 파일명에서 slug와 locale 추출
        // Match pattern: anything + .ko at the end (only Korean supported)
        const localeMatch = fileName.match(/^(.+)\.(ko)$/);
        let slug = localeMatch ? localeMatch[1] : fileName;
        const fileLocale = localeMatch ? localeMatch[2] : undefined;

        // 숫자 접두사 제거 (예: 00.content -> content)
        slug = slug.replace(/^\d+\./, '');

        // Filter by locale: only include 'ko' files
        if (fileLocale && fileLocale !== currentLocale) {
          continue; // Skip files that don't match the locale
        }
        // If file has no locale suffix, include it (for files without locale)

        // Build full slug including folder path
        // Remove the filename from itemPath and combine with slug
        const folderPath = relativePath ? path.dirname(itemPath) : '';
        const fullSlug =
          folderPath && folderPath !== '.'
            ? `${normalizePath(folderPath)}/${slug}`
            : slug;

        // Read frontmatter to get title
        let title: string | undefined;
        try {
          if (ext === '.ipynb') {
            // For ipynb files, read first markdown cell for frontmatter
            const notebookJson = JSON.parse(fs.readFileSync(entryFullPath, 'utf-8'));
            for (const cell of notebookJson.cells || []) {
              if (cell.cell_type === 'markdown') {
                const cellSource = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';
                if (cellSource.trim().startsWith('---')) {
                  try {
                    const { data: frontmatter } = matter(cellSource);
                    title = frontmatter.title;
                  } catch {
                    // If parsing fails, continue
                  }
                }
                break;
              }
            }
            // If no frontmatter found, try notebook metadata
            if (!title && notebookJson.metadata) {
              title = notebookJson.metadata.title;
            }
          } else {
            // For md files, read frontmatter normally
            const fileContent = fs.readFileSync(entryFullPath, 'utf-8');
            const { data: frontmatter } = matter(fileContent);
            title = frontmatter.title;
          }
        } catch {
          // If reading fails, title will remain undefined
        }

        items.push({
          name: entry.name,
          type: 'file',
          path: itemPath,
          slug: fullSlug,
          locale: fileLocale,
          title,
        });
      }
    }

    // Sort: folders first, then files, both alphabetically
    return items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  return buildTree(fullPath, '', locale);
}
