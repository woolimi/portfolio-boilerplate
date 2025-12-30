import { Icons } from '@/components/icons';
import { BriefcaseIcon, FileUser, HomeIcon, NotebookIcon } from 'lucide-react';

type Locale = 'ko';

export const TEXT_CHARS = ['J', 'o', 'h', 'n', ' ', 'D', 'o', 'e'] as const;

const DATA = {
  name: '홍길동',
  initials: 'HG',
  url: 'https://example.com',
  location: '서울특별시',
  locationLink: 'https://www.google.com/maps/place/서울특별시',
  description: 'Full Stack Developer',
  summary:
    '코드로 세상을 더 나은 곳으로 만들고자 하는 풀스택 개발자입니다.\n\n문제 해결을 즐기며, 복잡한 기술적 도전을 단순하고 우아한 솔루션으로 전환하는 것에 보람을 느낍니다. 사용자 중심의 사고를 바탕으로 직관적이고 효율적인 웹 애플리케이션을 설계하고 구현합니다.\n\n**실용적인 기술 스택으로 비즈니스 가치를 창출합니다.**\n\nReact, Next.js, TypeScript를 활용한 모던 프론트엔드 개발과 Node.js, Python 기반의 백엔드 시스템 구축 경험이 있습니다. 클라우드 인프라와 DevOps 도구를 활용하여 확장 가능하고 안정적인 서비스를 제공합니다.\n\n**지속적인 성장과 지식 공유를 추구합니다.**\n\n최신 기술 트렌드를 학습하고 실무에 적용하며, 오픈소스 기여와 기술 블로그 작성을 통해 커뮤니티와 함께 성장합니다. 팀과의 효과적인 소통을 통해 더 나은 제품을 만들어갑니다.',
  avatarUrl: '/me.png',
  skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
  languages: ['한국어', '영어'],
  aboutEcole42:
    '여기에 교육 기관에 대한 설명을 작성하세요. 예를 들어, 특별한 교육 프로그램이나 인증 과정에 대한 정보를 포함할 수 있습니다.',
  navbar: [
    { href: '/', icon: HomeIcon, label: 'HOME' },
    { href: '/resume', icon: FileUser, label: 'RESUME' },
    { href: '/projects', icon: BriefcaseIcon, label: 'PROJECTS' },
    { href: '/blog', icon: NotebookIcon, label: 'BLOG' },
  ],
  contact: {
    email: 'example@email.com',
    tel: '+82 10-0000-0000',
    social: {
      GitHub: {
        name: 'GitHub',
        url: 'https://github.com/example',
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/example',
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: '이메일 보내기',
        url: 'mailto:example@email.com',
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  work: [
    {
      company: '테크 스타트업',
      href: 'https://example.com',
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
      location: '서울',
      title: '풀스택 개발자',
      logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      start: '2023.01',
      end: '현재',
      description: '웹 애플리케이션 개발 및 유지보수. 사용자 경험 개선 및 성능 최적화 작업 수행',
    },
    {
      company: '소프트웨어 회사',
      href: 'https://example.com',
      skills: ['Vue', 'Nuxt', 'Python', 'Docker'],
      location: '서울',
      title: '프론트엔드 개발자',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png',
      start: '2021.06',
      end: '2022.12',
      description: '마케팅 웹사이트 및 관리자 대시보드 개발. 컴포넌트 라이브러리 구축 및 유지보수',
    },
    {
      company: 'IT 컨설팅',
      href: 'https://example.com',
      skills: ['React', 'Node.js', 'MongoDB'],
      location: '서울',
      title: '주니어 개발자',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png',
      start: '2020.03',
      end: '2021.05',
      description: '클라이언트 프로젝트 개발 및 기술 지원',
    },
  ],
  education: [
    {
      school: '대학교',
      degree: '컴퓨터공학과 학사',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png',
      start: '2016',
      end: '2020',
    },
  ],
} as const;

export function getResumeData(locale: Locale = 'ko') {
  return DATA;
}
