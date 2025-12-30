'use client';

import { BlurFade } from '@/components/ui/blur-fade';
import { Link } from '@/i18n/navigation';
import { formatBlogDate } from '@/lib/date';
import { Folder } from 'lucide-react';

type BlogPost = {
  metadata: {
    title: string;
    summary: string;
    image?: string;
    locale?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  slug: string;
};

type BlogArticleCardProps = {
  post: BlogPost;
  delay: number;
};

export function BlogArticleCard({ post, delay }: BlogArticleCardProps) {
  const createdAt = post.metadata.createdAt
    ? formatBlogDate(post.metadata.createdAt)
    : null;

  // Extract top-level category from slug (e.g., "python/01.number" -> "python")
  const category = post.slug.includes('/') ? post.slug.split('/')[0] : null;

  return (
    <BlurFade delay={delay}>
      <div className="hover:border-border hover:bg-accent/50 flex flex-col space-y-2 rounded-lg border border-transparent p-4 transition-all">
        <div className="flex w-full flex-col space-y-2">
          <div className="flex items-center gap-2">
            {category && (
              <Link
                href={`/blog/${category}`}
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground flex items-center gap-1.5 hover:underline"
              >
                <Folder className="h-3.5 w-3.5" />
                <span className="text-xs">{category}</span>
              </Link>
            )}
          </div>
          <Link href={`/blog/${post.slug}`} className="block">
            <p className="font-semibold tracking-tight">{post.metadata.title}</p>
            {post.metadata.summary && (
              <p className="text-foreground/80 line-clamp-2 text-sm leading-relaxed">
                {post.metadata.summary}
              </p>
            )}
            {createdAt && (
              <p className="text-muted-foreground/60 text-sm">
                작성일: {createdAt}
              </p>
            )}
          </Link>
        </div>
      </div>
    </BlurFade>
  );
}
