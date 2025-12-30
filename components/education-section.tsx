import { EducationCard } from '@/components/education-card';
import { BlurFade } from '@/components/ui/blur-fade';

type Education = {
  readonly school: string;
  readonly degree: string;
  readonly logoUrl: string;
  readonly start: string;
  readonly end: string;
};

type EducationSectionProps = {
  education: readonly Education[];
  delay: number;
};

export function EducationSection({ education, delay }: EducationSectionProps) {
  return (
    <section id="education">
      <div className="flex min-h-0 flex-col gap-y-5">
        <BlurFade delay={delay}>
          <h2 className="text-xl font-bold">Education</h2>
        </BlurFade>
        {education.map((educationItem, id) => (
          <BlurFade key={educationItem.school} delay={delay + 0.04 + id * 0.05}>
            <EducationCard
              logoUrl={educationItem.logoUrl}
              altText={educationItem.school}
              title={educationItem.school}
              subtitle={educationItem.degree}
              period={`${educationItem.start} - ${educationItem.end}`}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
