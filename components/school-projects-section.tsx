import { SchoolArticleCard } from '@/components/school-article-card';
import { BlurFade } from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import type { Project } from '@/data/projects';
import { Link } from '@/i18n/navigation';
type SchoolProjectsSectionProps = {
  recentSchoolProjects: Project[];
  schoolProjects: Project[];
  delay: number;
};

export async function SchoolProjectsSection({
  recentSchoolProjects,
  schoolProjects,
  delay,
}: SchoolProjectsSectionProps) {
  return (
    <section id="schools">
      <div className="w-full space-y-12 py-12">
        <BlurFade delay={delay}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="bg-foreground text-background inline-block rounded-lg px-3 py-1 text-sm">
                School Projects
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Academic Projects</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed">
                학업 과정 중 진행한 프로젝트입니다.
              </p>
            </div>
          </div>
        </BlurFade>
        {recentSchoolProjects.length > 0 ? (
          <>
            <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-4 md:grid-cols-2">
              {recentSchoolProjects.map((project, id) => (
                <SchoolArticleCard
                  key={project.id}
                  project={project}
                  delay={delay + 0.04 + id * 0.05}
                />
              ))}
            </div>
            {schoolProjects.length > 6 && (
              <BlurFade delay={delay + 0.08}>
                <div className="flex justify-center">
                  <Button asChild variant="outline">
                    <Link href="/projects/schools">더 보기</Link>
                  </Button>
                </div>
              </BlurFade>
            )}
          </>
        ) : (
          <BlurFade delay={delay + 0.04}>
            <p className="text-muted-foreground text-center">아직 등록된 프로젝트가 없습니다.</p>
          </BlurFade>
        )}
      </div>
    </section>
  );
}
