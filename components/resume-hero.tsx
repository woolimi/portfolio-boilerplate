import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlurFade } from '@/components/ui/blur-fade';

type SocialLink = {
  name: string;
  url: string;
  icon: React.ComponentType<React.HTMLAttributes<SVGElement>>;
  navbar?: boolean;
};

interface ResumeHeroProps {
  name: string;
  description: string;
  avatarUrl: string;
  initials: string;
  contact?: {
    social: {
      GitHub?: SocialLink;
      LinkedIn?: SocialLink;
      email?: SocialLink;
      [key: string]: SocialLink | undefined;
    };
  };
  delay?: number;
}

export function ResumeHero({
  name,
  description,
  avatarUrl,
  initials,
  contact,
  delay = 0.04,
}: ResumeHeroProps) {
  const socialLinks = contact?.social
    ? Object.entries(contact.social).filter(([key]) =>
        ['GitHub', 'LinkedIn', 'email'].includes(key),
      )
    : [];

  return (
    <section id="hero">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="flex justify-between gap-2">
          <div className="flex flex-1 flex-col space-y-1.5">
            <BlurFade
              delay={delay}
              className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
            >
              {name}
            </BlurFade>
            <BlurFade className="max-w-[600px] md:text-xl" delay={delay}>
              {description}
            </BlurFade>
            {socialLinks.length > 0 && (
              <BlurFade delay={delay} className="mt-2 flex items-center gap-3">
                {socialLinks.map(([key, social]) => {
                  if (!social) return null;
                  const Icon = social.icon;
                  return (
                    <a
                      key={key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </BlurFade>
            )}
          </div>
          <BlurFade delay={delay}>
            <Avatar className="size-28 border">
              <AvatarImage alt={name} src={avatarUrl} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
