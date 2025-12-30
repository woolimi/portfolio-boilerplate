'use client';

import { buttonVariants } from '@/components/ui/button';
import { Dock, DockIcon } from '@/components/ui/dock';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getResumeData } from '@/data/resume';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
export default function Navbar() {
  const locale = 'ko';
  const DATA = getResumeData(locale);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-10 z-30 mx-auto mb-4 flex h-full max-h-14 origin-bottom">
      <div className="bg-background fixed inset-x-0 bottom-0 h-16 w-full to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)]"></div>
      <Dock className="bg-background pointer-events-auto relative z-50 mx-auto flex h-full min-h-full transform-gpu items-center px-1 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]">
        {DATA.navbar.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-12')}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-12')}
                  >
                    <social.icon className="size-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
      </Dock>
    </div>
  );
}
