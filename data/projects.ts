import { getCurrentDateMidnight } from '@/lib/date';
import { getMarkdownFiles, normalizePath } from '@/lib/file-utils';
import { getGitCreatedDate, getGitUpdatedDate } from '@/lib/git';
import { markdownToHTML } from '@/lib/markdown';
import { parseNotebook } from '@/lib/notebook';
import type { NotebookData } from '@/lib/notebook.types';
import { parseSkills } from '@/lib/utils';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

type ProjectMetadata = {
  title: string;
  summary: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  school?: string; // schools 카테고리용
  work?: string; // professionals 카테고리용
  github?: string; // GitHub 링크
  website?: string; // 웹사이트 링크
  skills?: string | string[]; // 기술 스택 (쉼표로 구분된 문자열 또는 배열)
};

// Re-export types for backward compatibility
export type { NotebookCell, NotebookData } from '@/lib/notebook.types';

export type Project = {
  metadata: ProjectMetadata;
  id: string; // 파일명 기반 (확장자 제거)
  type: 'markdown' | 'notebook';
  source: string; // HTML 변환된 마크다운 또는 JSON 문자열 (노트북)
  notebookData?: NotebookData; // 노트북 데이터 (type이 'notebook'인 경우)
  originalFileName?: string; // 정렬용 원본 파일명
};

async function getProjectFile(
  id: string,
  category: string,
): Promise<{
  source: string;
  metadata: ProjectMetadata;
  id: string;
  type: 'markdown' | 'notebook';
  notebookData?: NotebookData;
} | null> {
  const categoryDir = path.join(process.cwd(), 'projects', category);

  if (!fs.existsSync(categoryDir)) {
    return null;
  }

  // ID에서 숫자 접두사 제거 (URL용 ID) - 예: "00.project" -> "project", "01.test" -> "test"
  const cleanId = id.replace(/^\d+\./, '');

  // 파일명 찾기: 숫자 접두사가 있는 파일과 없는 파일 모두 시도
  // .md와 .ipynb 모두 시도 (locale 없이)
  const files = fs.readdirSync(categoryDir);
  let filePath: string | null = null;
  let fileType: 'markdown' | 'notebook' = 'markdown';

  // 먼저 숫자 접두사가 있는 .md 파일 찾기
  let pattern = new RegExp(`^\\d+\\.${cleanId.replace(/\./g, '\\.')}\\.md$`);
  let matchingFile = files.find((f) => pattern.test(f));
  if (matchingFile) {
    filePath = path.join(categoryDir, matchingFile);
    fileType = 'markdown';
  } else {
    // 숫자 접두사가 있는 .ipynb 파일 찾기
    pattern = new RegExp(`^\\d+\\.${cleanId.replace(/\./g, '\\.')}\\.ipynb$`);
    matchingFile = files.find((f) => pattern.test(f));
    if (matchingFile) {
      filePath = path.join(categoryDir, matchingFile);
      fileType = 'notebook';
    } else {
      // 숫자 접두사 없는 파일 시도
      filePath = path.join(categoryDir, `${cleanId}.md`);
      if (fs.existsSync(filePath)) {
        fileType = 'markdown';
      } else {
        filePath = path.join(categoryDir, `${cleanId}.ipynb`);
        if (fs.existsSync(filePath)) {
          fileType = 'notebook';
        } else {
          filePath = null;
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

    // 메타데이터 추출 (노트북 메타데이터 또는 파일명 기반)
    // 노트북의 metadata 필드에서 모든 프론트매터 정보 추출
    const notebookMetadata = notebookData.metadata || {};

    // skills 파싱: 쉼표로 구분된 문자열을 배열로 변환
    const skills = parseSkills(notebookMetadata.skills);

    const metadata: ProjectMetadata = {
      title: notebookMetadata.title || cleanId,
      summary: notebookMetadata.summary || '',
      createdAt: gitCreatedDate || fallbackDate,
      updatedAt: gitUpdatedDate || fallbackDate,
      // 모든 메타데이터 필드 지원 (마크다운 프론트매터와 동일)
      ...(notebookMetadata.school && { school: notebookMetadata.school }),
      ...(notebookMetadata.work && { work: notebookMetadata.work }),
      ...(notebookMetadata.github && { github: notebookMetadata.github }),
      ...(notebookMetadata.website && { website: notebookMetadata.website }),
      ...(notebookMetadata.image && { image: notebookMetadata.image }),
      ...(skills && skills.length > 0 && { skills }),
    };

    return {
      source: JSON.stringify(notebookJson), // 원본 JSON 저장
      metadata,
      id: cleanId,
      type: 'notebook',
      notebookData,
    };
  } else {
    // 마크다운 파일 처리
    let source = fs.readFileSync(filePath, 'utf-8');
    const { content: rawContent, data } = matter(source);
    const content = await markdownToHTML(rawContent);

    // skills 파싱: 쉼표로 구분된 문자열을 배열로 변환
    const skills = parseSkills(data.skills);

    return {
      source: content,
      metadata: {
        title: data.title || cleanId,
        summary: data.summary || '',
        createdAt: gitCreatedDate || data.createdAt || fallbackDate,
        updatedAt: gitUpdatedDate || data.updatedAt || fallbackDate,
        ...(data.school && { school: data.school }),
        ...(data.work && { work: data.work }),
        ...(data.github && { github: data.github }),
        ...(data.website && { website: data.website }),
        ...(data.image && { image: data.image }),
        ...(skills && skills.length > 0 && { skills }),
      } as ProjectMetadata,
      id: cleanId,
      type: 'markdown',
    };
  }
}

async function getAllProjectsInCategory(category: string): Promise<Project[]> {
  const categoryDir = path.join(process.cwd(), 'projects', category);

  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const projectFiles = getMarkdownFiles(categoryDir);
  const projects = await Promise.all(
    projectFiles.map(async (file) => {
      // file is relative path from category dir (e.g., "00.project-name.md" or "00.project-name.ipynb")
      const fileExt = path.extname(file); // .md or .ipynb
      const fileName = path.basename(file, fileExt); // 확장자 제거
      const dirPath = path.dirname(file);
      const originalFileName = path.basename(file); // 정렬용 원본 파일명

      // 파일명에서 숫자 접두사 제거하여 id 추출
      const slug = fileName.replace(/^\d+\./, '');

      // If file is in subdirectory, include it in id
      const id = dirPath !== '.' ? normalizePath(path.join(dirPath, slug)) : slug;

      const project = await getProjectFile(id, category);
      if (!project) return null;

      // project.id는 이미 숫자 접두사가 제거된 상태 (cleanId)

      return {
        metadata: project.metadata,
        id: project.id,
        type: project.type,
        source: project.source,
        ...(project.notebookData && { notebookData: project.notebookData }),
        originalFileName, // 정렬용 원본 파일명 추가
      };
    }),
  );

  const validProjects = projects.filter(
    (project): project is Project & { originalFileName: string } =>
      project !== null && project.originalFileName !== undefined,
  );

  // 중복 제거: 같은 id를 가진 프로젝트 중 첫 번째 것만 유지
  const uniqueProjects = new Map<string, Project & { originalFileName: string }>();
  for (const project of validProjects) {
    const key = project.id;
    if (!uniqueProjects.has(key)) {
      uniqueProjects.set(key, project);
    }
  }

  // Sort by filename (reverse order - newest file number first)
  return Array.from(uniqueProjects.values()).sort((a, b) => {
    const fileNameA = a.originalFileName || '';
    const fileNameB = b.originalFileName || '';

    // 파일명에서 숫자 접두사 추출 (예: "00.libft.md" -> 0, "01.get_next_line.md" -> 1)
    const getFileNumber = (fileName: string): number => {
      const match = fileName.match(/^(\d+)\./);
      return match ? parseInt(match[1], 10) : -1;
    };

    const numA = getFileNumber(fileNameA);
    const numB = getFileNumber(fileNameB);

    // 숫자 접두사가 있으면 숫자로 비교, 없으면 파일명으로 비교
    if (numA !== -1 && numB !== -1) {
      return numB - numA; // 역순 (큰 숫자 먼저)
    }

    // 파일명으로 비교 (역순)
    return fileNameB.localeCompare(fileNameA);
  });
}

/**
 * Get projects by category
 * @param category - Project category ('personals' | 'schools' | 'professionals')
 * @returns Array of projects sorted by creation date (newest first)
 */
export async function getProjectsByCategory(
  category: 'personals' | 'schools' | 'professionals',
): Promise<Project[]> {
  return getAllProjectsInCategory(category);
}

/**
 * Get a single project by ID and category
 * @param id - Project ID (filename without extension)
 * @param category - Project category ('works' | 'personals' | 'schools' | 'professionals')
 * @returns Project or null if not found
 */
export async function getProject(
  id: string,
  category: 'works' | 'personals' | 'schools' | 'professionals',
): Promise<Project | null> {
  return getProjectFile(id, category);
}
