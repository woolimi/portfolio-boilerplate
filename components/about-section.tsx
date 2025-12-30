import { MarkdownContent } from '@/components/markdown-content';
import { BlurFade } from '@/components/ui/blur-fade';

type AboutSectionProps = {
  summary: string;
  delay: number;
};

export function AboutSection({ summary, delay }: AboutSectionProps) {
  return (
    <section id="about">
      <BlurFade delay={delay}>
        <h2 className="text-xl font-bold">About</h2>
      </BlurFade>
      <BlurFade delay={delay + 0.04}>
        <MarkdownContent>{summary}</MarkdownContent>
      </BlurFade>
    </section>
  );
}

