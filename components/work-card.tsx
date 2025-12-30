'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';

interface WorkCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  skills?: readonly string[];
  period: string;
  description?: string;
}

export function WorkCard({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  skills,
  period,
  description,
}: WorkCardProps) {
  const hasLink = href && href !== '#';
  const isInternalLink = href && (href.startsWith('/') || !href.startsWith('http'));
  const LinkComponent = isInternalLink ? Link : 'a';
  const linkProps = isInternalLink
    ? { href: href || '#' }
    : { href: href || '#', target: '_blank', rel: 'noopener noreferrer' };

  return (
    <div className="block">
      <Card className="flex">
        <div className="flex-none">
          <Avatar className="bg-muted-background m-auto size-12 border">
            <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-4 flex-grow flex-col items-center">
          <CardHeader>
            <div className="flex items-center justify-between gap-x-2 text-base">
              {hasLink ? (
                <LinkComponent {...linkProps} className="hover:underline">
                  <h3 className="text-xs leading-none font-semibold sm:text-sm">{title}</h3>
                </LinkComponent>
              ) : (
                <h3 className="text-xs leading-none font-semibold sm:text-sm">{title}</h3>
              )}
              <div className="text-muted-foreground text-right text-xs tabular-nums sm:text-sm">
                {period}
              </div>
            </div>
            {subtitle && (
              <div className="font-sans text-xs" dangerouslySetInnerHTML={{ __html: subtitle }} />
            )}
            {skills && skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <Badge variant="secondary" className="text-xs" key={index}>
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          {description && <div className="pt-2 text-xs sm:text-sm">{description}</div>}
        </div>
      </Card>
    </div>
  );
}
