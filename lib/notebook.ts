import type { NotebookData } from './notebook.types';
import matter from 'gray-matter';

/**
 * Parse Jupyter notebook JSON and extract front matter from first markdown cell
 * @param notebookJson - Raw notebook JSON object
 * @returns Parsed notebook data with front matter metadata merged
 */
export async function parseNotebook(notebookJson: any): Promise<NotebookData> {
  // 첫 번째 마크다운 셀에서 프론트매터 추출
  let frontMatterMetadata: any = {};

  for (let i = 0; i < (notebookJson.cells || []).length; i++) {
    const cell = notebookJson.cells[i];
    if (cell.cell_type === 'markdown') {
      const cellSource = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';

      // YAML 프론트매터가 있는지 확인
      if (cellSource.trim().startsWith('---')) {
        try {
          const parsed = matter(cellSource);
          frontMatterMetadata = parsed.data || {};

          // 프론트매터를 제거한 내용으로 셀 업데이트 (렌더링용)
          // 원본 notebookJson은 변경하지 않음
        } catch (error) {
          // 프론트매터 파싱 실패 시 무시
          console.warn('Failed to parse front matter in notebook:', error);
        }
      }
      break;
    }
  }

  // 셀 처리 (프론트매터가 있는 첫 번째 마크다운 셀의 경우 프론트매터 제거)
  const cells = (notebookJson.cells || []).map((cell: any, index: number) => {
    const cellData: any = {
      cell_type: cell.cell_type,
      source: cell.source || [],
      outputs: cell.outputs || [],
      execution_count: cell.execution_count ?? null,
      metadata: cell.metadata || {},
    };

    // 첫 번째 마크다운 셀이고 프론트매터가 있는 경우 프론트매터 제거
    if (
      cell.cell_type === 'markdown' &&
      index === 0 &&
      Object.keys(frontMatterMetadata).length > 0
    ) {
      const cellSource = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';

      if (cellSource.trim().startsWith('---')) {
        try {
          const parsed = matter(cellSource);
          // 프론트매터를 제거한 내용만 사용
          cellData.source = parsed.content.split('\n').map((line: string) => line + '\n');
        } catch (error) {
          // 파싱 실패 시 원본 유지
        }
      }
    }

    return cellData;
  });

  // 노트북 metadata와 프론트매터를 병합 (프론트매터가 우선)
  const mergedMetadata = {
    ...(notebookJson.metadata || {}),
    ...frontMatterMetadata,
  };

  return {
    cells,
    metadata: mergedMetadata,
  };
}

