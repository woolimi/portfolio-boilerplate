'use client';

import { SchoolArticleCard } from '@/components/school-article-card';
import { SchoolSkillsFilter } from '@/components/school-skills-filter';
import { BlurFade } from '@/components/ui/blur-fade';
import type { Project } from '@/data/projects';
import { parseSkills } from '@/lib/utils';
import { useMemo, useState } from 'react';

type SchoolProjectsListProps = {
  projects: Project[];
  skills: string[];
};

export function SchoolProjectsList({ projects, skills }: SchoolProjectsListProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (!selectedSkill) {
      return projects;
    }

    return projects.filter((project) => {
      const projectSkills = parseSkills(project.metadata.skills);
      return projectSkills.includes(selectedSkill);
    });
  }, [projects, selectedSkill]);

  const BLUR_FADE_DELAY = 0.04;

  return (
    <>
      <BlurFade delay={BLUR_FADE_DELAY * 1.5}>
        <SchoolSkillsFilter
          skills={skills}
          selectedSkill={selectedSkill}
          onSkillSelect={setSelectedSkill}
        />
      </BlurFade>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredProjects.map((project, id) => (
            <SchoolArticleCard
              key={project.id}
              project={project}
              delay={BLUR_FADE_DELAY * 2 + id * 0.05}
            />
          ))}
        </div>
      ) : (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-muted-foreground text-center">
            {selectedSkill ? `No projects found with skill: ${selectedSkill}` : 'No projects found'}
          </p>
        </BlurFade>
      )}
    </>
  );
}
