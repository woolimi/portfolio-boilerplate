'use client';

import { Badge } from '@/components/ui/badge';
import { BlurFade } from '@/components/ui/blur-fade';
import type { Project } from '@/data/projects';
import { Link } from '@/i18n/navigation';
import { formatBlogDate } from '@/lib/date';
import { parseSkills } from '@/lib/utils';
import Image from 'next/image';

type ProjectArticleCardProps = {
  project: Project;
  category: 'works' | 'personals' | 'schools' | 'professionals';
  delay: number;
};

export function ProjectArticleCard({ project, category, delay }: ProjectArticleCardProps) {
  const createdAt = project.metadata.createdAt
    ? formatBlogDate(project.metadata.createdAt)
    : null;
  const updatedAt = project.metadata.updatedAt
    ? formatBlogDate(project.metadata.updatedAt)
    : null;
  const showBothDates = createdAt && updatedAt && createdAt !== updatedAt;

  // 기술 스택 처리
  const skills = parseSkills(project.metadata.skills);

  return (
    <BlurFade delay={delay}>
      <Link
        className="group border-border bg-card hover:shadow-primary/10 relative flex h-full flex-col overflow-hidden rounded-sm border transition-all hover:shadow-lg"
        href={`/projects/${category}/${project.id}`}
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
              {project.metadata.work && category === 'professionals' && (
                <span className="text-muted-foreground -mb-1 text-xs font-semibold">
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

          {/* GitHub 및 Website 뱃지 */}
          {(project.metadata.github || project.metadata.website) && (
            <div className="mt-auto flex flex-wrap gap-2">
              {project.metadata.github && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(project.metadata.github, '_blank', 'noopener,noreferrer');
                  }}
                  className="flex w-fit cursor-pointer items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </div>
              )}
              {project.metadata.website && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(project.metadata.website, '_blank', 'noopener,noreferrer');
                  }}
                  className="flex w-fit cursor-pointer items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
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
          )}
        </div>
      </Link>
    </BlurFade>
  );
}
