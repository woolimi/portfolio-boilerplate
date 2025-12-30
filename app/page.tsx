import InteractiveHero from '@/components/interactive-hero';

// 정적 생성을 강제
export const dynamic = 'force-static';
export const dynamicParams = false;

export default async function HomePage() {
  return <InteractiveHero />;
}
