import { Badge } from '@/components/ui/badge';
import { BlurFade } from '@/components/ui/blur-fade';

type LanguagesSectionProps = {
  languages: readonly string[];
  delay: number;
};

export function LanguagesSection({ languages, delay }: LanguagesSectionProps) {
  return (
    <section id="languages">
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={delay}>
          <h2 className="text-xl font-bold">Languages</h2>
        </BlurFade>
        <div className="flex flex-wrap gap-1">
          {languages.map((language, id) => (
            <BlurFade key={language} delay={delay + 0.04 + id * 0.05}>
              <Badge>{language}</Badge>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

