// Import custom theme JSON file
import moonlightTheme from '../themes/moonlight-ii.json';
import { transformerCopyButton } from '@rehype-pretty/transformers';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

/**
 * Convert markdown string to HTML using unified pipeline
 * @param markdown - Markdown string to convert
 * @returns HTML string
 */
export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['heading-link'],
        'aria-hidden': 'true',
      },
    })
    .use(rehypeKatex)
    // @ts-ignore - rehype-pretty-code type definitions issue
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      // Use custom theme from external JSON file
      // You can replace moonlightTheme with any custom theme JSON
      theme: moonlightTheme,
      keepBackground: true, // Keep theme background
      transformers: [
        transformerCopyButton({
          visibility: 'hover',
          feedbackDuration: 3000,
        }),
      ],
      onVisitLine(node: any) {
        // Prevent lines from collapsing
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }];
        }
      },
      onVisitHighlightedLine(node: any) {
        // Add class for highlighted lines
        node.properties.className = ['line', 'line--highlighted'];
      },
      onVisitHighlightedWord(node: any) {
        // Add class for highlighted words
        node.properties.className = ['word', 'word--highlighted'];
      },
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

