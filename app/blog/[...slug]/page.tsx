import { BlogArticleCard } from '@/components/blog-article-card';
import { BlogPagination } from '@/components/blog-pagination';
import { JupyterNotebookViewer } from '@/components/jupyter-notebook-viewer';
import { BlurFade } from '@/components/ui/blur-fade';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getBlogPosts, getBlogPostsByCategory, getPost } from '@/data/blog';
import { getResumeData } from '@/data/resume';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const POSTS_PER_PAGE = 10;

export async function generateStaticParams() {
  const params: Array<{ slug: string[] }> = [];
  const categoryPaths = new Set<string>();

  const posts = await getBlogPosts();
  for (const post of posts) {
    // Split slug by '/' to create array for catch-all route
    params.push({ slug: post.slug.split('/') });

    // Extract all possible category paths from slug
    // e.g., "python/0.settings" -> ["python"]
    // e.g., "nextjs/react/hooks" -> ["nextjs", "nextjs/react"]
    const slugParts = post.slug.split('/');
    for (let i = 1; i < slugParts.length; i++) {
      const categoryPath = slugParts.slice(0, i).join('/');
      categoryPaths.add(categoryPath);
    }
  }

  // Add category paths as params (including pagination)
  for (const categoryPath of categoryPaths) {
    // Add first page (no pagination)
    params.push({ slug: categoryPath.split('/') });

    // Add pagination pages
    const categoryPosts = await getBlogPostsByCategory(categoryPath);
    const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);
    for (let page = 2; page <= totalPages; page++) {
      params.push({ slug: [...categoryPath.split('/'), 'p', String(page)] });
    }
  }

  return params;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string[];
  }>;
}): Promise<Metadata | undefined> {
  const { slug: slugArray } = await params;
  // Decode URL-encoded parts in slugArray
  const decodedSlugArray = slugArray.map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });
  const slug = decodedSlugArray.join('/');
  const DATA = getResumeData();
  let post = await getPost(slug);

  // If it's a category page, generate metadata for category
  if (!post) {
    // Use original slugArray.join('/') for getBlogPostsByCategory to handle URL encoding
    const categoryPathForQuery = slugArray.join('/');
    const categoryPosts = await getBlogPostsByCategory(categoryPathForQuery);
    if (categoryPosts.length > 0) {
      const categoryName = slug.split('/').pop() || slug;
      const title = categoryName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return {
        title: `${title} - Blog`,
        description: `Posts in ${title} category`,
      };
    }
    return undefined;
  }

  let { title, summary: description, image } = post.metadata;
  let ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${DATA.url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

const BLUR_FADE_DELAY = 0.04;

export default async function Blog({
  params,
}: {
  params: Promise<{
    slug: string[];
  }>;
}) {
  const { slug: slugArray } = await params;

  // Enable static rendering
  const breadcrumbLabels = {
    home: 'Home',
    blog: 'Blog',
  };
  const DATA = getResumeData();

  // Check if the last two elements are 'p' and a page number (pagination)
  let categoryPath = slugArray;
  let pageNumber = 1;
  const isPagination =
    slugArray.length >= 2 &&
    slugArray[slugArray.length - 2] === 'p' &&
    !isNaN(parseInt(slugArray[slugArray.length - 1], 10));

  if (isPagination) {
    pageNumber = parseInt(slugArray[slugArray.length - 1], 10);
    if (pageNumber < 1) {
      notFound();
    }
    categoryPath = slugArray.slice(0, -2); // Remove 'p' and page number
  }

  // Decode URL-encoded parts in categoryPath (e.g., "folder%201" -> "folder 1")
  const decodedCategoryPath = categoryPath.map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });

  const slug = decodedCategoryPath.join('/');
  let post = await getPost(slug);

  // Build breadcrumb items from slug
  const slugParts = decodedCategoryPath;
  const breadcrumbItems = [
    { label: breadcrumbLabels.home, href: '/' },
    { label: breadcrumbLabels.blog, href: '/blog' },
  ];

  // If post exists, only add category paths (exclude the filename)
  if (post) {
    // Add intermediate path segments (exclude the last one which is the filename)
    let currentPath = '/blog';
    for (let i = 0; i < slugParts.length - 1; i++) {
      let part = slugParts[i];
      // Decode URL-encoded characters (e.g., %20 -> space)
      try {
        part = decodeURIComponent(part);
      } catch {
        // If decoding fails, use original part
      }
      currentPath += `/${encodeURIComponent(part)}`;
      // Capitalize first letter and replace hyphens with spaces
      const label = part
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbItems.push({ label, href: currentPath });
    }
    // Add post title as the last breadcrumb item
    breadcrumbItems.push({ label: post.metadata.title, href: '' });

    return (
      <section id="blog" className="mb-30">
        <BlurFade delay={BLUR_FADE_DELAY} duration={0.5} blur="4px">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              {breadcrumbItems.flatMap((item, index) => {
                const elements = [];
                if (index > 0) {
                  elements.push(<BreadcrumbSeparator key={`separator-${index}`} />);
                }
                elements.push(
                  <BreadcrumbItem key={`item-${index}`}>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>,
                );
                return elements;
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.metadata.title,
                description: post.metadata.summary,
                image: post.metadata.image
                  ? `${DATA.url}${post.metadata.image}`
                  : `${DATA.url}/og?title=${post.metadata.title}`,
                url: `${DATA.url}/blog/${post.slug}`,
                author: {
                  '@type': 'Person',
                  name: DATA.name,
                },
              }),
            }}
          />
          <h1 className="mt-2 mb-6 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl sm:leading-tight md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight">
            {post.metadata.title}
          </h1>
          {post.type === 'notebook' && post.notebookData ? (
            <article className="prose max-w-none">
              <JupyterNotebookViewer notebook={post.notebookData} />
            </article>
          ) : (
            <article
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.source }}
            ></article>
          )}
        </BlurFade>
      </section>
    );
  }

  // If post doesn't exist, check if it's a category path
  // Use original categoryPath.join('/') for getBlogPostsByCategory to handle URL encoding
  const categoryPathForQuery = categoryPath.join('/');
  const categoryPosts = await getBlogPostsByCategory(categoryPathForQuery);
  if (categoryPosts.length === 0) {
    notFound();
  }

  // Add category paths to breadcrumb (for category pages, all slugParts are categories)
  let currentPath = '/blog';
  for (let i = 0; i < slugParts.length; i++) {
    let part = slugParts[i];
    // Decode URL-encoded characters (e.g., %20 -> space)
    try {
      part = decodeURIComponent(part);
    } catch {
      // If decoding fails, use original part
    }
    currentPath += `/${encodeURIComponent(part)}`;
    // Capitalize first letter and replace hyphens with spaces
    const label = part
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbItems.push({ label, href: currentPath });
  }

  // Render category listing page with pagination
  const categoryName = slugParts[slugParts.length - 1];
  const categoryTitle = categoryName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);

  if (pageNumber > totalPages && totalPages > 0) {
    notFound();
  }

  const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = categoryPosts.slice(startIndex, endIndex);

  const categoryBasePath = `/blog/${slug}`;

  return (
    <section id="blog" className="mb-30">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          {breadcrumbItems.flatMap((item, index) => {
            const elements = [];
            if (index > 0) {
              elements.push(<BreadcrumbSeparator key={`separator-${index}`} />);
            }
            elements.push(
              <BreadcrumbItem key={`item-${index}`}>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>,
            );
            return elements;
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1
          className="mb-8 text-2xl font-bold tracking-normal"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          {categoryTitle}
        </h1>
      </BlurFade>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {paginatedPosts.map((post, id) => (
          <BlogArticleCard key={post.slug} post={post} delay={BLUR_FADE_DELAY * 2 + id * 0.05} />
        ))}
      </div>
      <BlogPagination
        currentPage={pageNumber}
        totalPages={totalPages}
        basePath={categoryBasePath}
      />
    </section>
  );
}
