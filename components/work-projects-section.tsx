import { BlurFade } from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { WorkProjectCard } from '@/components/work-project-card';
import { getProjectsByCategory } from '@/data/projects';
import { Link } from '@/i18n/navigation';
type WorkProjectsSectionProps = {
  delay: number;
};

export async function WorkProjectsSection({ delay }: WorkProjectsSectionProps) {
  const professionalProjects = await getProjectsByCategory('professionals');
  const recentProfessionalProjects = professionalProjects.slice(0, 6);

  return (
    <section id="work-projects">
      <div className="w-full space-y-12 py-12">
        <BlurFade delay={delay}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="bg-foreground text-background inline-block rounded-lg px-3 py-1 text-sm">
                Work Projects
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Professional Projects</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed">
                직장에서 또는 전문적으로 의뢰를 받아 작업한 프로젝트들
              </p>
            </div>
          </div>
        </BlurFade>
        {recentProfessionalProjects.length > 0 ? (
          <>
            <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-4 md:grid-cols-2">
              {recentProfessionalProjects.map((project, id) => (
                <WorkProjectCard
                  key={project.id}
                  project={project}
                  delay={delay + 0.04 + id * 0.05}
                />
              ))}
            </div>
            {professionalProjects.length > 6 && (
              <BlurFade delay={delay + 0.08}>
                <div className="flex justify-center">
                  <Button asChild variant="outline">
                    <Link href="/projects/professionals">더 보기</Link>
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
