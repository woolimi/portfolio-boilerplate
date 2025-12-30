import { BlogArticleCard } from '@/components/blog-article-card';
import { BlogPagination } from '@/components/blog-pagination';
import { BlurFade } from '@/components/ui/blur-fade';
import { getBlogPosts } from '@/data/blog';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

const POSTS_PER_PAGE = 10;

export async function generateStaticParams() {
  const params: Array<{ page: string }> = [];
  const posts = await getBlogPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    params.push({ page: String(i) });
  }

  return params;
}

export const metadata = {
  title: 'Blog',
  description: 'My thoughts on software development, life, and more.',
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const allPosts = await getBlogPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  if (pageNumber > totalPages && totalPages > 0) {
    notFound();
  }

  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return (
    <div className="mb-30">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1
          className="mb-8 text-2xl font-bold tracking-normal"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          BLOG
        </h1>
      </BlurFade>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((post, id) => (
          <BlogArticleCard
            key={post.slug}
            post={post}
            delay={BLUR_FADE_DELAY * 2 + id * 0.05}
          />
        ))}
      </div>

      <BlogPagination
        currentPage={pageNumber}
        totalPages={totalPages}
        basePath="/blog"
      />
    </div>
  );
}
