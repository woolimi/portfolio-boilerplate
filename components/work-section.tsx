import { WorkCard } from '@/components/work-card';
import { BlurFade } from '@/components/ui/blur-fade';

type Work = {
  readonly company: string;
  readonly href?: string;
  readonly skills: readonly string[];
  readonly location: string;
  readonly title: string;
  readonly logoUrl: string;
  readonly start: string;
  readonly end?: string;
  readonly description: string;
};

type WorkSectionProps = {
  work: readonly Work[];
  totalExperience: string;
  delay: number;
};

export function WorkSection({ work, totalExperience, delay }: WorkSectionProps) {
  return (
    <section id="work">
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={delay}>
          <h2 className="text-xl font-bold">Work Experience ({totalExperience})</h2>
        </BlurFade>
        {work.map((workItem, id) => (
          <BlurFade key={workItem.company} delay={delay + 0.04 + id * 0.05}>
            <WorkCard
              logoUrl={workItem.logoUrl}
              altText={workItem.company}
              title={workItem.company}
              subtitle={workItem.title}
              href={workItem.href}
              skills={workItem.skills}
              period={`${workItem.start} - ${workItem.end ?? 'Present'}`}
              description={workItem.description}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

