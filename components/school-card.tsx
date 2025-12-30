import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Props {
  school: string;
  title: string;
  description: string;
  dates: string;
  location: string;
  image?: string;
  links?: readonly {
    icon: React.ReactNode;
    title: string;
    href: string;
  }[];
}

export function SchoolCard({ school, title, description, dates, location, image, links }: Props) {
  return (
    <li className="relative ml-10 py-4">
      <div className="absolute top-2 -left-16 flex items-center justify-center rounded-full bg-white">
        <Avatar className="m-auto size-12 border">
          <AvatarImage src={image} alt={title} className="object-contain" />
          <AvatarFallback>{title[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col justify-start gap-1">
        {dates && <time className="text-muted-foreground text-xs">{dates}</time>}
        <h2 className="leading-none font-semibold">{title}</h2>
        {school && <p className="text-muted-foreground text-sm font-medium">{school}</p>}
        {location && <p className="text-muted-foreground text-sm">{location}</p>}
        {description && (
          <span className="prose text-muted-foreground text-sm">
            {description}
          </span>
        )}
      </div>
      {links && links.length > 0 && (
        <div className="mt-2 flex flex-row flex-wrap items-start gap-2">
          {links?.map((link, idx) => (
            <a href={link.href} key={idx} target="_blank" rel="noopener noreferrer">
              <Badge key={idx} title={link.title} className="flex gap-2">
                {link.icon}
                {link.title}
              </Badge>
            </a>
          ))}
        </div>
      )}
    </li>
  );
}
