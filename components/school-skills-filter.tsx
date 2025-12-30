'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SchoolSkillsFilterProps = {
  skills: string[];
  selectedSkill: string | null;
  onSkillSelect: (skill: string | null) => void;
};

export function SchoolSkillsFilter({
  skills,
  selectedSkill,
  onSkillSelect,
}: SchoolSkillsFilterProps) {
  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {skills.map((skill) => {
        const isSelected = selectedSkill === skill;
        return (
          <button
            key={skill}
            type="button"
            onClick={() => onSkillSelect(isSelected ? null : skill)}
            className={cn(
              'rounded-full transition-all hover:scale-105 focus:outline-none',
              !isSelected && 'focus:ring-primary focus:ring-2',
            )}
            aria-pressed={isSelected}
            aria-label={`Filter by ${skill}`}
          >
            <Badge
              variant={isSelected ? 'default' : 'secondary'}
              className={cn(
                'cursor-pointer text-xs font-medium',
                isSelected && 'ring-primary ring-2 ring-offset-2',
              )}
            >
              {skill}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
