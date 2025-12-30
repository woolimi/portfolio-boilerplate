import { CiGlobe } from 'react-icons/ci';
import { FaGithub } from 'react-icons/fa';

type ProjectLinkButtonProps = {
  href: string;
  type: 'github' | 'website';
  className?: string;
};

export function ProjectLinkButton({ href, type, className }: ProjectLinkButtonProps) {
  const labels = {
    github: 'GitHub',
    website: 'Website',
  };

  const icons = {
    github: FaGithub,
    website: CiGlobe,
  };

  const Icon = icons[type];
  const label = labels[type];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 ${className || ''}`}
    >
      <Icon className="size-4" />
      {label}
    </a>
  );
}
