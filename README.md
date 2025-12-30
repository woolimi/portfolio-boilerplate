# 포트폴리오 블로그 템플릿

Next.js 기반의 정적 포트폴리오 및 블로그 사이트 템플릿입니다. 마크다운과 Jupyter Notebook을 지원하며, GitHub Pages에 배포할 수 있습니다.

## 주요 기능

- 📝 **마크다운 기반 콘텐츠**: `.md` 파일로 블로그 글 작성
- 📓 **Jupyter Notebook 지원**: `.ipynb` 파일로 데이터 분석 포스트 작성
- 💼 **프로젝트 포트폴리오**: 개인/전문/학업 프로젝트를 카테고리별로 관리
- 📄 **이력서 페이지**: TypeScript로 작성한 구조화된 이력서 데이터
- 🎨 **모던 디자인**: Tailwind CSS와 shadcn/ui 기반의 깔끔한 UI
- ⚡ **정적 사이트 생성**: 빠른 로딩 속도와 SEO 최적화
- 📱 **반응형 디자인**: 모바일부터 데스크톱까지 완벽 지원

## 기술 스택

- **프레임워크**: Next.js 16.0.4 (App Router)
- **UI 라이브러리**: React 19.2.0
- **스타일링**: Tailwind CSS v4
- **컴포넌트**: shadcn/ui
- **마크다운 처리**: unified, remark, rehype
- **코드 하이라이팅**: rehype-pretty-code, shiki
- **애니메이션**: framer-motion
- **타입 안정성**: TypeScript

## 시작하기

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
# 정적 사이트 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

## GitHub Pages 배포

배포는 `pnpm release` 명령어를 사용합니다:

```bash
pnpm release [github-repository-url]
```

해당 스크립트는 다음을 수행합니다.

1. 프로젝트 빌드 (`pnpm build`)
2. `out/` 디렉토리로 이동
3. Git 저장소 초기화 및 커밋
4. 지정된 GitHub 저장소의 `main` 브랜치로 푸시

## 프로젝트 구조

```
/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 홈 페이지
│   ├── blog/              # 블로그 관련 페이지
│   │   ├── page.tsx       # 블로그 목록
│   │   ├── p/             # 페이지네이션
│   │   └── [...slug]/     # 블로그 상세 및 카테고리
│   ├── projects/          # 프로젝트 관련 페이지
│   │   ├── page.tsx       # 프로젝트 목록
│   │   ├── personals/     # 개인 프로젝트
│   │   ├── professionals/ # 전문 프로젝트
│   │   └── schools/       # 학업 프로젝트
│   └── resume/            # 이력서 페이지
├── components/            # React 컴포넌트
│   └── ui/                # shadcn/ui 컴포넌트
├── content/               # 블로그 콘텐츠 (마크다운/노트북)
├── data/                  # 데이터 파일
│   ├── resume.tsx        # 이력서 데이터
│   ├── blog.ts            # 블로그 유틸리티
│   └── projects.ts        # 프로젝트 유틸리티
├── lib/                   # 유틸리티 함수
├── projects/              # 프로젝트 문서
│   ├── personals/         # 개인 프로젝트
│   ├── professionals/     # 전문 프로젝트
│   └── schools/           # 학업 프로젝트
└── public/                # 정적 파일
```

## 콘텐츠 작성 가이드

### 1. 이력서 작성

`data/resume.tsx` 파일을 수정하여 이력서 정보를 작성합니다.

```typescript
const DATA = {
  name: '홍길동',
  initials: 'HG',
  url: 'https://example.com',
  location: '서울특별시',
  description: 'Full Stack Developer',
  summary: '이력서 요약 내용...',
  skills: ['React', 'Next.js', 'TypeScript'],
  work: [
    {
      company: '회사명',
      title: '직책',
      start: '2023.01',
      end: '현재',
      description: '업무 설명',
      // ...
    },
  ],
  education: [
    {
      school: '대학교',
      degree: '학위',
      start: '2016',
      end: '2020',
    },
  ],
  // ...
};
```

### 2. 프로젝트 작성

`projects/` 디렉토리 하위에 카테고리별로 프로젝트 문서를 작성합니다.

#### 파일 구조

- `projects/personals/00.project-name.md` - 개인 프로젝트
- `projects/professionals/00.project-name.md` - 전문 프로젝트
- `projects/schools/00.project-name.md` - 학업 프로젝트

#### 프론트매터 형식

**개인 프로젝트 (personals):**

```yaml
---
title: '[프로젝트 제목을 입력하세요]'
summary: '[프로젝트 요약을 한 줄로 입력하세요]'
github: '[GitHub 저장소 URL]'
website: '[프로젝트 웹사이트 URL]'
image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop'
skills: '[사용 기술 스택, 쉼표로 구분]'
---
```

**전문 프로젝트 (professionals):**

```yaml
---
title: '[프로젝트 제목을 입력하세요]'
summary: '[프로젝트 요약을 한 줄로 입력하세요]'
work: '[회사 식별자]'
image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'
skills: '[사용 기술 스택, 쉼표로 구분]'
website: '[프로젝트 웹사이트 URL]'
github: '[GitHub 저장소 URL]'
---
```

**학업 프로젝트 (schools):**

```yaml
---
title: '[프로젝트 제목을 입력하세요]'
summary: '[프로젝트 요약을 한 줄로 입력하세요]'
school: '[학교 식별자]'
github: '[GitHub 저장소 URL]'
image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'
skills: '[사용 기술 스택, 쉼표로 구분]'
---
```

#### 파일명 규칙

- 숫자 접두사로 정렬 순서 지정: `00.project-name.md`, `01.another-project.md`
- 파일명의 숫자 접두사는 URL에서 제거됩니다 (예: `00.project-name.md` → `/projects/personals/project-name`)

### 3. 블로그 글 작성

`content/` 디렉토리 하위에 폴더를 만들거나 직접 마크다운 파일을 작성합니다.

#### 파일 구조 예시

```
content/
├── folder-1/
│   └── 00.post-title.md
├── folder-2/
│   ├── 00.post-title.md
│   └── sub-folder/
│       └── 00.post-title.md
└── 00.post-title.md
```

#### 프론트매터 형식

```yaml
---
title: 포스트 제목
summary: 포스트 요약 (한 줄 설명)
image: /images/post-image.jpg (선택사항)
---
```

#### URL 구조

- 파일 경로가 URL로 변환됩니다
- 예: `content/folder-1/00.post-title.md` → `/blog/folder-1/post-title`
- 폴더명은 카테고리로 자동 인식됩니다

### 4. Jupyter Notebook 작성

Jupyter Notebook 파일(`.ipynb`)도 블로그 포스트나 프로젝트 문서로 사용할 수 있습니다. 첫번째 셀에 마크다운으로 프론트매터를 작성하시면 됩니다.

## 라이선스

MIT License
