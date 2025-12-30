import { BlogContentTreeDesktop, BlogContentTreeMobile } from '@/components/blog-content-tree-desktop';
import { getContentTree } from '@/data/content-tree';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = 'ko';
  const contentTree = getContentTree('content', locale);

  return (
    <main className="flex min-h-screen justify-center px-6 py-12 sm:py-24 lg:gap-8">
      <section className="w-full max-w-3xl">{children}</section>

      <BlogContentTreeDesktop
        tree={contentTree}
        className="hidden w-64 shrink-0 lg:block"
      />

      <div className="lg:hidden">
        <BlogContentTreeMobile tree={contentTree} />
      </div>
    </main>
  );
}
