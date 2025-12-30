import { BlurFade } from '@/components/ui/blur-fade';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjectsByCategory } from '@/data/projects';
import { Link } from '@/i18n/navigation';
import { Briefcase, GraduationCap, User } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '프로젝트',
    description: '프로젝트를 카테고리별로 확인할 수 있습니다.',
  };
}

const BLUR_FADE_DELAY = 0.04;

type CategoryInfo = {
  key: 'personals' | 'professionals' | 'schools';
  translationNamespace: 'PersonalProjects' | 'WorkProjects' | 'SchoolProjects';
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const CATEGORIES: CategoryInfo[] = [
  {
    key: 'personals',
    translationNamespace: 'PersonalProjects',
    href: '/projects/personals',
    icon: User,
  },
  {
    key: 'professionals',
    translationNamespace: 'WorkProjects',
    href: '/projects/professionals',
    icon: Briefcase,
  },
  {
    key: 'schools',
    translationNamespace: 'SchoolProjects',
    href: '/projects/schools',
    icon: GraduationCap,
  },
];

const TRANSLATIONS = {
  PersonalProjects: {
    title: 'Side Projects',
    description: '여가 시간에 만든 개인 프로젝트들',
  },
  WorkProjects: {
    title: 'Professional Projects',
    description: '직장에서 또는 전문적으로 의뢰를 받아 작업한 프로젝트들',
  },
  SchoolProjects: {
    title: 'Academic Projects',
    description: '학업 과정 중 진행한 프로젝트입니다.',
  },
};

export default async function ProjectsPage() {
  // Fetch project counts for each category
  const categoryData = await Promise.all(
    CATEGORIES.map(async (category) => {
      const projects = await getProjectsByCategory(category.key);
      const translations = TRANSLATIONS[category.translationNamespace];
      return {
        ...category,
        title: translations.title,
        description: translations.description,
        count: projects.length,
        Icon: category.icon,
      };
    }),
  );

  return (
    <main className="mx-auto max-w-[900px] px-4 pt-20 pb-40">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1
          className="mb-8 text-2xl font-bold tracking-normal"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          프로젝트
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">프로젝트를 카테고리별로 확인할 수 있습니다.</p>
      </BlurFade>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {categoryData.map((category, index) => {
          const Icon = category.Icon;
          return (
            <BlurFade key={category.key} delay={BLUR_FADE_DELAY * 2 + index * 0.1}>
              <Link
                href={category.href}
                className="group border-border bg-card hover:shadow-primary/10 relative flex h-full flex-col overflow-hidden rounded-sm border transition-all hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col space-y-4 p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4">
                    <div className="bg-muted group-hover:bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-md transition-colors">
                      <Icon className="text-muted-foreground group-hover:text-primary h-6 w-6 transition-colors" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <CardTitle className="group-hover:text-primary mb-1 text-xl font-bold tracking-tight transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-xs font-medium">
                        {`${category.count}개의 프로젝트`}
                      </CardDescription>
                    </div>
                  </div>

                  {/* Description */}
                  <CardContent className="p-0">
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </CardContent>
                </div>
              </Link>
            </BlurFade>
          );
        })}
      </div>
    </main>
  );
}
