import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader } from '@/components/ui/card';

interface EducationCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  period: string;
}

export function EducationCard({ logoUrl, altText, title, subtitle, period }: EducationCardProps) {
  return (
    <div className="block">
      <Card className="flex items-center">
        <div className="flex-none">
          <Avatar className="bg-muted-background m-auto size-12 border">
            <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-4 flex-grow flex-col items-center">
          <CardHeader>
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3 className="mb-2 text-xs leading-none font-semibold sm:text-sm">{title}</h3>
              <div className="text-muted-foreground text-right text-xs tabular-nums sm:text-sm">
                {period}
              </div>
            </div>
            {subtitle && (
              <div
                className="font-sans text-xs [&_a]:underline hover:[&_a]:text-gray-700"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </CardHeader>
        </div>
      </Card>
    </div>
  );
}
