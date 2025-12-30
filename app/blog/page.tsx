import { BlogArticleCard } from '@/components/blog-article-card';
import { BlogPagination } from '@/components/blog-pagination';
import { BlurFade } from '@/components/ui/blur-fade';
import { getBlogPosts } from '@/data/blog';

export const dynamic = 'force-static';
export const dynamicParams = false;

const POSTS_PER_PAGE = 10;

export const metadata = {
  title: 'Blog',
  description: 'My thoughts on software development, life, and more.',
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const posts = allPosts.slice(0, POSTS_PER_PAGE);

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

      <BlogPagination currentPage={1} totalPages={totalPages} basePath="/blog" />
    </div>
  );
}
