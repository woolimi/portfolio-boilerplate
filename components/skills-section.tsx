import { Badge } from '@/components/ui/badge';
import { BlurFade } from '@/components/ui/blur-fade';

type SkillsSectionProps = {
  skills: readonly string[];
  delay: number;
};

export function SkillsSection({ skills, delay }: SkillsSectionProps) {
  return (
    <section id="skills">
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={delay}>
          <h2 className="text-xl font-bold">Skills</h2>
        </BlurFade>
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, id) => (
            <BlurFade key={skill} delay={delay + 0.04 + id * 0.05}>
              <Badge>{skill}</Badge>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

