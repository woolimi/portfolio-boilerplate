import { SchoolProjectsList } from '@/components/school-projects-list';
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
    title: 'Academic Projects',
    description: '학업 과정 중 진행한 프로젝트입니다.',
  };
}

const BLUR_FADE_DELAY = 0.04;

export default async function SchoolsPage() {
  const projects = await getProjectsByCategory('schools');

  // Extract unique skills from all projects
  const uniqueSkills = new Set<string>();
  projects.forEach((project) => {
    const skills = Array.isArray(project.metadata.skills)
      ? project.metadata.skills
      : typeof project.metadata.skills === 'string'
        ? project.metadata.skills.split(',').map((s) => s.trim())
        : [];

    skills.forEach((skill) => {
      if (skill) {
        uniqueSkills.add(skill);
      }
    });
  });

  const sortedSkills = Array.from(uniqueSkills).sort();

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Resume', href: '/resume' },
    { label: 'Academic Projects', href: '' },
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
          Academic Projects
        </h1>
      </BlurFade>

      <SchoolProjectsList projects={projects} skills={sortedSkills} />
    </main>
  );
}
