import { BlurFade } from '@/components/ui/blur-fade';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { WorkProjectCard } from '@/components/work-project-card';
import { getProjectsByCategory } from '@/data/projects';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Professional Projects',
    description: '직장에서 또는 전문적으로 의뢰를 받아 작업한 프로젝트들',
  };
}

const BLUR_FADE_DELAY = 0.04;

export default async function ProfessionalsPage() {
  const projects = await getProjectsByCategory('professionals');

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Resume', href: '/resume' },
    { label: 'Professional Projects', href: '' },
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
          Professional Projects
        </h1>
      </BlurFade>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project, id) => (
            <WorkProjectCard
              key={project.id}
              project={project}
              delay={BLUR_FADE_DELAY * 2 + id * 0.05}
            />
          ))}
        </div>
      ) : (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-muted-foreground text-center">아직 등록된 프로젝트가 없습니다.</p>
        </BlurFade>
      )}
    </main>
  );
}

