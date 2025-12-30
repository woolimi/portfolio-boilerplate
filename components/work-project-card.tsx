'use client';

import { Badge } from '@/components/ui/badge';
import { BlurFade } from '@/components/ui/blur-fade';
import type { Project } from '@/data/projects';
import { Link } from '@/i18n/navigation';
import { formatBlogDate } from '@/lib/date';
import Image from 'next/image';

type WorkProjectCardProps = {
  project: Project;
  delay: number;
};

export function WorkProjectCard({ project, delay }: WorkProjectCardProps) {
  const createdAt = project.metadata.createdAt
    ? formatBlogDate(project.metadata.createdAt)
    : null;
  const updatedAt = project.metadata.updatedAt
    ? formatBlogDate(project.metadata.updatedAt)
    : null;
  const showBothDates = createdAt && updatedAt && createdAt !== updatedAt;

  // 기술 스택 처리
  const skills = Array.isArray(project.metadata.skills)
    ? project.metadata.skills
    : typeof project.metadata.skills === 'string'
      ? project.metadata.skills.split(',').map((s) => s.trim())
      : [];

  return (
    <BlurFade delay={delay}>
      <Link
        className="group border-border bg-card hover:shadow-primary/10 relative flex h-full flex-col overflow-hidden rounded-sm border transition-all hover:shadow-lg"
        href={`/projects/professionals/${project.id}`}
      >
        {/* 이미지 영역 */}
        {project.metadata.image && (
          <div className="bg-muted relative h-48 w-full overflow-hidden">
            <Image
              src={project.metadata.image}
              alt={project.metadata.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col space-y-4 p-2">
          {/* 헤더 영역 */}
          <div className="flex flex-col space-y-2">
            {project.metadata.school && (
              <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {project.metadata.school}
              </div>
            )}
            <div className="flex flex-col">
              {project.metadata.work && (
                <span className="text-muted-foreground mb-1 text-xs font-semibold">
                  @{project.metadata.work}
                </span>
              )}
              <h3 className="group-hover:text-primary text-xl font-bold tracking-tight transition-colors">
                {project.metadata.title}
              </h3>
            </div>
          </div>

          {/* 요약 */}
          {project.metadata.summary && (
            <p className="text-muted-foreground line-clamp-3 text-sm">{project.metadata.summary}</p>
          )}

          {/* 기술 스택 */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-medium">
                  {skill}
                </Badge>
              ))}
              {skills.length > 4 && (
                <Badge variant="secondary" className="text-xs font-medium">
                  +{skills.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Website 뱃지 */}
          {project.metadata.website && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(project.metadata.website, '_blank', 'noopener,noreferrer');
              }}
              className="mt-auto flex w-fit cursor-pointer items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              website
            </div>
          )}
        </div>
      </Link>
    </BlurFade>
  );
}
