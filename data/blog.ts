import { getCurrentDateMidnight } from '@/lib/date';
import { getMarkdownFiles, normalizePath } from '@/lib/file-utils';
import { getGitCreatedDate, getGitUpdatedDate } from '@/lib/git';
import { markdownToHTML } from '@/lib/markdown';
import { parseNotebook } from '@/lib/notebook';
import type { NotebookData } from '@/lib/notebook.types';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

type Metadata = {
  title: string;
  summary: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Re-export types for backward compatibility
export type { NotebookCell, NotebookData } from '@/lib/notebook.types';

export async function getPost(slug: string): Promise<{
  source: string;
  metadata: Metadata;
  slug: string;
  type: 'markdown' | 'notebook';
  notebookData?: NotebookData;
} | null> {
  // slug can include folder path (e.g., "nextjs/introduction" or "folder 1/introduction")
  // URL에서 온 경우 공백이 %20으로 인코딩되어 있을 수 있으므로 디코딩
  // slug를 디코딩하여 실제 파일 경로로 변환
  let decodedSlug: string;
  try {
    // URL 디코딩 시도 (공백이 %20으로 인코딩된 경우 처리)
    decodedSlug = decodeURIComponent(slug);
  } catch {
    // 디코딩 실패 시 원본 사용
    decodedSlug = slug;
  }

  // 파일 찾기: {slug}.md 또는 {slug}.ipynb 형식으로 찾기
  // 숫자 접두사가 있는 파일과 없는 파일 모두 시도
  let filePath: string | null = null;
  let fileType: 'markdown' | 'notebook' = 'markdown';

  const extensions = ['.md', '.ipynb'];

  // slug의 마지막 부분(파일명)에서 숫자 접두사 제거
  const slugParts = decodedSlug.split('/');
  const lastPart = slugParts[slugParts.length - 1];
  const cleanLastPart = lastPart.replace(/^\d+\./, '');
  const cleanSlug =
    slugParts.length > 1 ? [...slugParts.slice(0, -1), cleanLastPart].join('/') : cleanLastPart;

  for (const ext of extensions) {
    // 먼저 숫자 접두사 없는 파일 찾기
    const testPath = normalizePath(path.join('content', `${cleanSlug}${ext}`));
    if (fs.existsSync(testPath)) {
      filePath = testPath;
      fileType = ext === '.ipynb' ? 'notebook' : 'markdown';
      break;
    }
    // 숫자 접두사 있는 파일도 시도 (00., 01., 02. 등 다양한 패턴)
    // 디렉토리 내의 파일들을 검색하여 숫자 접두사가 있는 파일 찾기
    const dirParts = slugParts.length > 1 ? slugParts.slice(0, -1) : [];
    const dirPath = normalizePath(
      dirParts.length > 0 ? path.join('content', ...dirParts) : 'content',
    );
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      const fileNameWithoutExt = cleanLastPart;
      // 숫자 접두사가 있는 파일 찾기 (예: 00.content.md, 01.content.md 등)
      const matchingFile = files.find((file) => {
        const fileExt = path.extname(file);
        if (fileExt !== ext) return false;
        const fileBaseName = path.basename(file, fileExt);
        // 숫자 접두사 제거 후 비교
        const fileBaseNameWithoutPrefix = fileBaseName.replace(/^\d+\./, '');
        return fileBaseNameWithoutPrefix === fileNameWithoutExt;
      });
      if (matchingFile) {
        const testPathWithNumber = normalizePath(path.join(dirPath, matchingFile));
        if (fs.existsSync(testPathWithNumber)) {
          filePath = testPathWithNumber;
          fileType = ext === '.ipynb' ? 'notebook' : 'markdown';
          break;
        }
      }
    }
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  // Get git dates
  const gitCreatedDate = await getGitCreatedDate(filePath);
  const gitUpdatedDate = await getGitUpdatedDate(filePath);
  const fallbackDate = getCurrentDateMidnight();

  if (fileType === 'notebook') {
    // 주피터 노트북 파일 처리
    const notebookJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const notebookData = await parseNotebook(notebookJson);

    // 노트북 메타데이터에서 title, summary 추출
    const notebookMetadata = notebookData.metadata || {};
    const metadata: Metadata = {
      title: notebookMetadata.title || slug.split('/').pop() || 'Untitled',
      summary: notebookMetadata.summary || '',
      image: notebookMetadata.image,
      createdAt: gitCreatedDate || fallbackDate,
      updatedAt: gitUpdatedDate || fallbackDate,
    };

    return {
      source: '', // 노트북은 source를 사용하지 않음
      metadata,
      slug,
      type: 'notebook',
      notebookData,
    };
  } else {
    // 마크다운 파일 처리
    let source = fs.readFileSync(filePath, 'utf-8');
    const { content: rawContent, data: metadata } = matter(source);
    const content = await markdownToHTML(rawContent);

    return {
      source: content,
      metadata: {
        ...metadata,
        createdAt: gitCreatedDate || fallbackDate,
        updatedAt: gitUpdatedDate || fallbackDate,
      } as Metadata,
      slug,
      type: 'markdown',
    };
  }
}

async function getAllPosts(dir: string) {
  let blogFiles = getMarkdownFiles(dir);
  const posts = await Promise.all(
    blogFiles.map(async (file) => {
      // file is relative path from content dir (e.g., "nextjs/introduction.md" or "ai/57.model-mesurement.ipynb")
      const ext = path.extname(file);
      const fileNameWithoutExt = path.basename(file, ext);
      const dirPath = path.dirname(file);

      // 파일명에서 숫자 접두사 제거하여 slug 생성
      const slug = fileNameWithoutExt.replace(/^\d+\./, '');

      // Build full slug with folder path (숫자 접두사 제거된 slug 사용)
      const fullSlug = dirPath !== '.' ? normalizePath(path.join(dirPath, slug)) : slug;

      // getPost는 숫자 접두사가 있는 파일과 없는 파일 모두 찾을 수 있음
      const post = await getPost(fullSlug);
      if (!post) return null;

      return {
        metadata: post.metadata,
        slug: fullSlug, // 숫자 접두사가 제거된 slug 반환
        source: post.source,
        type: post.type,
        notebookData: post.notebookData,
      };
    }),
  );

  return posts.filter((post): post is NonNullable<typeof post> => post !== null);
}

export async function getBlogPosts() {
  const posts = await getAllPosts(path.join(process.cwd(), 'content'));
  // Sort by createdAt (newest first)
  return posts.sort((a, b) => {
    const dateA = a.metadata.createdAt ? new Date(a.metadata.createdAt).getTime() : 0;
    const dateB = b.metadata.createdAt ? new Date(b.metadata.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });
}

/**
 * Get blog posts filtered by category path prefix
 * @param categoryPath - Category path (e.g., "nextjs" or "nextjs/react" or "folder%201")
 * @returns Filtered blog posts that start with the category path
 */
export async function getBlogPostsByCategory(categoryPath: string): Promise<
  Array<{
    metadata: Metadata;
    slug: string;
    source: string;
    type: 'markdown' | 'notebook';
    notebookData?: NotebookData;
  }>
> {
  // Decode URL-encoded category path (e.g., "folder%201" -> "folder 1")
  let decodedCategoryPath: string;
  try {
    decodedCategoryPath = decodeURIComponent(categoryPath);
  } catch {
    decodedCategoryPath = categoryPath;
  }

  const allPosts = await getBlogPosts();
  return allPosts.filter(
    (post) => post.slug.startsWith(decodedCategoryPath + '/') || post.slug === decodedCategoryPath,
  );
}
