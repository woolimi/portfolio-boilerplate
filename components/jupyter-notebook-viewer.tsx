/** @jsxImportSource @emotion/react */
'use client';

import type { NotebookData, NotebookCell } from '@/lib/notebook.types';
import { cn } from '@/lib/utils';
import moonlightTheme from '@/themes/moonlight-ii.json';
import { css } from '@emotion/react';
import 'katex/dist/katex.min.css';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { getSingletonHighlighter } from 'shiki';

interface JupyterNotebookViewerProps {
  notebook: NotebookData;
  className?: string;
}

function renderOutput(output: any, index: number) {
  if (!output) return null;

  const outputType = output.output_type;

  if (outputType === 'stream') {
    const text = output.text || [];
    const textContent = Array.isArray(text) ? text.join('') : text;
    return (
      <div
        key={index}
        className="overflow-x-auto rounded-md font-mono text-sm"
        style={{ background: 'var(--code-bg)' }}
      >
        <pre className="p-3 font-bold whitespace-pre-wrap text-white">{textContent}</pre>
      </div>
    );
  }

  if (outputType === 'error') {
    const traceback = output.traceback || [];
    return (
      <div key={index} className="rounded-md border border-red-200 bg-red-50 p-3 font-mono text-sm">
        <div className="mb-1 font-semibold text-red-600">
          {output.ename}: {output.evalue}
        </div>
        {traceback.length > 0 && (
          <pre className="whitespace-pre-wrap text-red-700">{traceback.join('\n')}</pre>
        )}
      </div>
    );
  }

  if (outputType === 'execute_result' || outputType === 'display_data') {
    const data = output.data || {};

    // 이미지 출력
    if (data['image/png']) {
      const imageData = Array.isArray(data['image/png'])
        ? data['image/png'].join('')
        : data['image/png'];
      return (
        <div key={index} className="my-2">
          <img
            src={`data:image/png;base64,${imageData}`}
            alt="Notebook output"
            className="h-auto max-w-full rounded-md"
          />
        </div>
      );
    }
    if (data['image/jpeg']) {
      const imageData = Array.isArray(data['image/jpeg'])
        ? data['image/jpeg'].join('')
        : data['image/jpeg'];
      return (
        <div key={index} className="my-2">
          <img
            src={`data:image/jpeg;base64,${imageData}`}
            alt="Notebook output"
            className="h-auto max-w-full rounded-md"
          />
        </div>
      );
    }
    if (data['image/svg+xml']) {
      const svgContent = Array.isArray(data['image/svg+xml'])
        ? data['image/svg+xml'].join('')
        : data['image/svg+xml'];
      return <div key={index} className="my-2" dangerouslySetInnerHTML={{ __html: svgContent }} />;
    }

    // HTML 출력 (pandas DataFrame 등)
    if (data['text/html']) {
      const htmlContent = Array.isArray(data['text/html'])
        ? data['text/html'].join('')
        : data['text/html'];
      const hasPlainText = data['text/plain'];

      const dataframeStyles = css`
        /* pandas DataFrame 스타일 지원 */
        .dataframe {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
          margin: 0;
          font-size: 0.875rem;
        }
        .dataframe thead th {
          background-color: hsl(var(--muted));
          font-weight: 600;
          text-align: right;
          padding: 0.5rem;
          border-bottom: 2px solid hsl(var(--border));
        }
        .dataframe tbody tr {
          border-bottom: 1px solid hsl(var(--border));
        }
        .dataframe tbody tr:hover {
          background-color: hsl(var(--muted) / 0.5);
        }
        .dataframe tbody td {
          padding: 0.5rem;
          text-align: right;
        }
        .dataframe tbody th {
          padding: 0.5rem;
          font-weight: 600;
          text-align: left;
        }
        /* 다크모드 지원 */
        @media (prefers-color-scheme: dark) {
          .dataframe thead th {
            background-color: hsl(var(--muted) / 0.3);
          }
        }
      `;

      return (
        <div key={index} className="my-2">
          <div
            className="notebook-html-output overflow-x-auto"
            css={dataframeStyles}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          {/* HTML 렌더링 실패 시 fallback으로 text/plain 표시 */}
          {hasPlainText && (
            <details className="mt-2">
              <summary className="text-muted-foreground cursor-pointer text-xs">
                Plain text view
              </summary>
              <div
                className="mt-1 overflow-x-auto rounded-md font-mono text-sm"
                style={{ background: 'var(--code-bg)' }}
              >
                <pre className="p-3 whitespace-pre-wrap text-white">
                  {Array.isArray(data['text/plain'])
                    ? data['text/plain'].join('')
                    : data['text/plain']}
                </pre>
              </div>
            </details>
          )}
        </div>
      );
    }

    // LaTeX 출력
    if (data['text/latex']) {
      const latexContent = Array.isArray(data['text/latex'])
        ? data['text/latex'].join('')
        : data['text/latex'];
      return (
        <div key={index} className="my-2">
          <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {`$$${latexContent}$$`}
          </Markdown>
        </div>
      );
    }

    // 텍스트 출력 (가장 일반적인 경우)
    if (data['text/plain']) {
      const textContent = Array.isArray(data['text/plain'])
        ? data['text/plain'].join('')
        : data['text/plain'];
      return (
        <div
          key={index}
          className="overflow-x-auto rounded-md font-mono text-sm"
          style={{ background: 'var(--code-bg)' }}
        >
          <pre className="p-3 font-bold whitespace-pre-wrap text-white">{textContent}</pre>
        </div>
      );
    }
  }

  return null;
}

function NotebookCell({ cell, index }: { cell: NotebookCell; index: number }) {
  const cellType = cell.cell_type;
  const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';

  if (cellType === 'markdown') {
    const tableStyles = css`
      /* 마크다운 표 스타일 */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        font-size: 0.875rem;
        overflow-x: auto;
        display: block;
      }
      thead {
        background-color: hsl(var(--muted));
      }
      thead th {
        font-weight: 600;
        padding: 0.75rem;
        text-align: left;
        border-bottom: 2px solid hsl(var(--border));
      }
      tbody tr {
        border-bottom: 1px solid hsl(var(--border));
      }
      tbody tr:hover {
        background-color: hsl(var(--muted) / 0.5);
      }
      tbody td {
        padding: 0.75rem;
      }
      tbody th {
        padding: 0.75rem;
        font-weight: 600;
        text-align: left;
      }
      /* 다크모드 지원 */
      @media (prefers-color-scheme: dark) {
        thead {
          background-color: hsl(var(--muted) / 0.3);
        }
      }
    `;

    return (
      <div className="prose prose-sm my-4 max-w-none">
        <div css={tableStyles}>
          <Markdown
            remarkPlugins={[remarkBreaks, remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children }) => (
                <p className="my-2 max-w-full font-sans text-sm text-pretty">{children}</p>
              ),
              code: ({ children, className: codeClassName }) => {
                const isInline = !codeClassName;
                if (isInline) {
                  return <code className="rounded px-1.5 py-0.5 text-sm">{children}</code>;
                }
                return <code className={codeClassName}>{children}</code>;
              },
              pre: ({ children }) => (
                <pre
                  className="my-2 overflow-x-auto rounded-lg"
                  style={{ background: 'var(--code-bg)' }}
                >
                  <div className="p-4">{children}</div>
                </pre>
              ),
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto">
                  <table className="w-full border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr className="border-border border-b">{children}</tr>,
              th: ({ children }) => (
                <th className="border-border border-b px-3 py-2 text-left font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border-border border-b px-3 py-2">{children}</td>
              ),
            }}
          >
            {source}
          </Markdown>
        </div>
      </div>
    );
  }

  if (cellType === 'code') {
    const [highlightedCode, setHighlightedCode] = useState<string>('');
    const [isHighlighting, setIsHighlighting] = useState(true);

    useEffect(() => {
      // 언어 감지 (주피터 노트북의 metadata에서 언어를 가져올 수 있지만, 기본적으로 python으로 가정)
      const language = 'python'; // 또는 cell.metadata?.language || 'python'

      // shiki를 사용한 코드 하이라이팅
      getSingletonHighlighter({
        themes: [moonlightTheme as any],
        langs: [language],
      })
        .then((highlighter) => {
          return highlighter.codeToHtml(source, {
            lang: language,
            theme: moonlightTheme.name,
          });
        })
        .then((html: string) => {
          setHighlightedCode(html);
          setIsHighlighting(false);
        })
        .catch((error: unknown) => {
          console.error('Code highlighting error:', error);
          setIsHighlighting(false);
        });
    }, [source]);

    return (
      <div className="my-4">
        <div className="mb-2 flex items-center gap-2">
          {cell.execution_count !== null && cell.execution_count !== undefined && (
            <span className="text-muted-foreground font-mono text-xs">
              In [{cell.execution_count}]:
            </span>
          )}
        </div>
        <div
          className="overflow-x-auto rounded-lg"
          style={{ background: 'var(--code-bg)' }}
        >
          {isHighlighting ? (
            <pre className="font-mono text-sm" style={{ color: 'var(--code-text, #c9d1d9)' }}>
              <code style={{ color: 'var(--code-text, #c9d1d9)' }}>{source}</code>
            </pre>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          )}
        </div>
        {cell.outputs && cell.outputs.length > 0 && (
          <div className="mt-2 space-y-2">
            {cell.outputs.map((output, idx) => renderOutput(output, idx))}
          </div>
        )}
      </div>
    );
  }

  if (cellType === 'raw') {
    return (
      <div
        className="my-4 rounded-lg"
        style={{ background: 'var(--code-bg)' }}
      >
        <pre className="text-foreground p-4 font-mono text-sm whitespace-pre-wrap">{source}</pre>
      </div>
    );
  }

  return null;
}

export function JupyterNotebookViewer({ notebook, className }: JupyterNotebookViewerProps) {
  if (!notebook || !notebook.cells) {
    return <div>No notebook data available</div>;
  }

  return (
    <div className={cn('notebook-viewer', className)}>
      {notebook.cells.map((cell, index) => (
        <NotebookCell key={index} cell={cell} index={index} />
      ))}
    </div>
  );
}
