import { AboutSection } from '@/components/about-section';
import { EducationSection } from '@/components/education-section';
import { LanguagesSection } from '@/components/languages-section';
import { PersonalProjectsSection } from '@/components/personal-projects-section';
import { ResumeHero } from '@/components/resume-hero';
import { SchoolProjectsSection } from '@/components/school-projects-section';
import { SkillsSection } from '@/components/skills-section';
import { WorkProjectsSection } from '@/components/work-projects-section';
import { WorkSection } from '@/components/work-section';
import { getProjectsByCategory } from '@/data/projects';
import { getResumeData } from '@/data/resume';
import { calculateTotalExperience } from '@/lib/utils';

const BLUR_FADE_DELAY = 0.04;

// 정적 생성을 강제
export const dynamic = 'force-static';
export const dynamicParams = false;

export default async function Page() {
  const locale = 'ko';
  const DATA = getResumeData(locale);
  const totalExperience = calculateTotalExperience(DATA.work);
  const schoolProjects = await getProjectsByCategory('schools');
  const recentSchoolProjects = schoolProjects.slice(0, 6);
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col space-y-10 px-4 py-30">
      <ResumeHero
        name={DATA.name}
        description={DATA.description}
        avatarUrl={DATA.avatarUrl}
        initials={DATA.initials}
        contact={DATA.contact}
        delay={BLUR_FADE_DELAY}
      />

      <AboutSection summary={DATA.summary} delay={BLUR_FADE_DELAY * 3} />
      <WorkSection work={DATA.work} totalExperience={totalExperience} delay={BLUR_FADE_DELAY * 5} />
      <EducationSection education={DATA.education} delay={BLUR_FADE_DELAY * 9} />
      <SkillsSection skills={DATA.skills} delay={BLUR_FADE_DELAY * 11} />
      <LanguagesSection languages={DATA.languages} delay={BLUR_FADE_DELAY * 12} />
      <WorkProjectsSection delay={BLUR_FADE_DELAY * 13} />
      <PersonalProjectsSection delay={BLUR_FADE_DELAY * 15} />
      <SchoolProjectsSection
        recentSchoolProjects={recentSchoolProjects}
        schoolProjects={schoolProjects}
        delay={BLUR_FADE_DELAY * 17}
      />
    </main>
  );
}
