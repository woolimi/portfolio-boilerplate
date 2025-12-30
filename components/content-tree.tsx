'use client';

import type { TreeNode } from '@/data/content-tree';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ContentTreeProps {
  tree: TreeNode[];
  className?: string;
}

function TreeItem({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const [isOpen, setIsOpen] = useState(false); // Initially collapsed
  const pathname = usePathname();
  const isFolder = node.type === 'folder';
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFolder && hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const getHref = () => {
    if (node.type === 'file' && node.slug) {
      return `/blog/${node.slug}`;
    }
    return '#';
  };

  // Check if current path matches the slug (handle URL encoding)
  const isActive =
    node.type === 'file' &&
    node.slug &&
    (pathname.includes(`/blog/${node.slug}`) ||
      pathname.includes(`/blog/${encodeURIComponent(node.slug)}`));

  // For files, use title from frontmatter if available, otherwise remove locale and .md extension
  // For folders, use name as-is
  const displayName =
    node.type === 'file'
      ? node.title || node.name.replace(/\.(ko|en)\.md$/, '').replace(/\.md$/, '')
      : node.name;

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm transition-colors',
          'hover:bg-accent/50',
          isActive && 'bg-accent text-foreground',
          !isActive && 'text-muted-foreground',
          level > 0 && 'ml-4',
        )}
      >
        {isFolder && hasChildren && (
          <button
            onClick={handleToggle}
            className="hover:bg-accent flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            <svg
              className={cn('h-3 w-3 transition-transform duration-200', isOpen && 'rotate-90')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {isFolder && !hasChildren && <span className="h-4 w-4 shrink-0" />}
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[10px]">
          {isFolder ? (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <Link
          href={getHref()}
          onClick={isFolder && hasChildren ? handleToggle : undefined}
          className={cn(
            'flex-1 truncate transition-colors',
            isActive ? 'font-medium' : 'font-normal',
          )}
        >
          {displayName}
        </Link>
      </div>
      {isFolder && hasChildren && isOpen && (
        <div className="border-border/50 mt-0.5 ml-2 space-y-0.5 border-l pl-2">
          {node.children!.map((child, index) => (
            <TreeItem
              key={`${child.path}-${index}`}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ContentTree({ tree, className }: ContentTreeProps) {
  if (tree.length === 0) {
    return null;
  }

  return (
    <div className={cn('w-full max-w-64', className)}>
      <div>
        <div className="mb-3 px-1.5">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Content
          </h2>
        </div>
        <nav className="max-h-[calc(100vh-10rem)] overflow-y-auto">
          <div className="space-y-0.5">
            {tree.map((node, index) => (
              <TreeItem key={`${node.path}-${index}`} node={node} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
