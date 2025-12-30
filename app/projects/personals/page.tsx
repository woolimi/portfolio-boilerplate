import { ProjectArticleCard } from '@/components/project-article-card';
import { BlurFade } from '@/components/ui/blur-fade';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getProjectsByCategory } from '@/data/projects';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '개인 프로젝트',
    description: '여가 시간에 만든 개인 프로젝트들',
  };
}

const BLUR_FADE_DELAY = 0.04;

export default async function PersonalsPage() {
  const projects = await getProjectsByCategory('personals');

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Resume', href: '/resume' },
    { label: 'Personal Projects', href: '' },
  ];

  return (
    <main className="mx-auto max-w-[900px] px-4 pt-20 pb-40">
      <BlurFade delay={BLUR_FADE_DELAY}>
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
        <h1
          className="mb-8 text-2xl font-bold tracking-normal"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          Personal Projects
        </h1>
      </BlurFade>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project, id) => (
            <ProjectArticleCard
              key={project.id}
              project={project}
              category="personals"
              delay={BLUR_FADE_DELAY * 2 + id * 0.05}
            />
          ))}
        </div>
      ) : (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-muted-foreground text-center">
            아직 등록된 프로젝트가 없습니다.
          </p>
        </BlurFade>
      )}
    </main>
  );
}
