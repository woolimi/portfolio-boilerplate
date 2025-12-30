import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';

interface MarkdownContentProps {
  children: string;
  className?: string;
}

export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <Markdown
        remarkPlugins={[remarkBreaks, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => (
            <p className="text-muted-foreground my-2 max-w-full font-sans text-sm text-pretty">
              {children}
            </p>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground max-w-full font-sans text-sm text-pretty">
              {children}
            </li>
          ),
          ul: ({ children }) => (
            <ul className="text-muted-foreground max-w-full font-sans text-sm text-pretty">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="text-muted-foreground max-w-full font-sans text-sm text-pretty">
              {children}
            </ol>
          ),
          h1: ({ children }) => (
            <h1 className="text-muted-foreground max-w-full font-sans text-sm text-pretty">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-muted-foreground max-w-full font-sans text-sm text-pretty">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-muted-foreground max-w-full font-sans text-sm text-pretty">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-muted-foreground max-w-full font-sans text-sm text-pretty">
              {children}
            </h4>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return <code>{children}</code>;
            }
            return <code className={codeClassName}>{children}</code>;
          },
          pre: ({ children }) => (
            <pre className="bg-muted overflow-x-auto rounded-lg p-4">{children}</pre>
          ),
          a: ({ children, href }) => {
            // PDF 파일이나 외부 링크, 절대 경로는 일반 <a> 태그 사용
            const isExternal =
              href?.startsWith('http://') ||
              href?.startsWith('https://') ||
              href?.startsWith('mailto:');
            const isStaticFile =
              href?.endsWith('.pdf') ||
              href?.endsWith('.png') ||
              href?.endsWith('.jpg') ||
              href?.endsWith('.jpeg') ||
              href?.endsWith('.gif');
            const isAbsolutePath =
              href?.startsWith('/') &&
              !href.startsWith('/blog') &&
              !href.startsWith('/resume') &&
              !href.startsWith('/projects');

            if (isExternal || isStaticFile || isAbsolutePath) {
              return (
                <a
                  href={href || '#'}
                  className="text-blue-500 hover:underline"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              );
            }

            return (
              <Link href={href || '#'} className="text-blue-500 hover:underline">
                {children}
              </Link>
            );
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
