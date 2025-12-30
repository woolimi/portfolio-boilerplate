import { JupyterNotebookViewer } from '@/components/jupyter-notebook-viewer';
import { ProjectLinkButton } from '@/components/project-link-button';
import { Badge } from '@/components/ui/badge';
import { BlurFade } from '@/components/ui/blur-fade';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getProject, getProjectsByCategory } from '@/data/projects';
import { getResumeData } from '@/data/resume';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: Array<{ id: string }> = [];

  const projects = await getProjectsByCategory('personals');
  for (const project of projects) {
    params.push({ id: project.id });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata | undefined> {
  const locale = 'ko';
  const { id } = await params;
  const DATA = getResumeData(locale);
  const project = await getProject(id, 'personals');

  if (!project) {
    return undefined;
  }

  const { title, summary: description, image } = project.metadata;
  const ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${DATA.url}/projects/personals/${project.id}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

const BLUR_FADE_DELAY = 0.04;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const locale = 'ko';
  const { id } = await params;

  const DATA = getResumeData(locale);

  const project = await getProject(id, 'personals');

  if (!project) {
    notFound();
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Resume', href: '/resume' },
    { label: 'Personal Projects', href: '/projects/personals' },
    { label: project.metadata.title, href: '' },
  ];

  return (
    <section id="project" className="mx-auto max-w-4xl px-6 pt-20 pb-40">
      <BlurFade delay={BLUR_FADE_DELAY} duration={0.5} blur="4px">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumbItems.flatMap((item, index) => {
              const elements = [];
              if (index > 0) {
                elements.push(<BreadcrumbSeparator key={`separator-${index}`} />);
              }
              elements.push(
                <BreadcrumbItem key={`item-${index}`}>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>,
              );
              return elements;
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Project',
              name: project.metadata.title,
              description: project.metadata.summary,
              image: project.metadata.image
                ? `${DATA.url}${project.metadata.image}`
                : `${DATA.url}/og?title=${project.metadata.title}`,
              url: `${DATA.url}/projects/personals/${project.id}`,
              author: {
                '@type': 'Person',
                name: DATA.name,
              },
            }),
          }}
        />
        <div className="mb-8 space-y-4">
          <h1 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl sm:leading-tight md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight">
            {project.metadata.title}
          </h1>
          {project.metadata.image && (
            <Image
              src={project.metadata.image}
              alt={project.metadata.title}
              width={1200}
              height={630}
              className="my-6 h-auto w-full rounded-lg"
            />
          )}
          {project.metadata.summary && (
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg md:text-xl">
              {project.metadata.summary}
            </p>
          )}
          {project.metadata.skills &&
            Array.isArray(project.metadata.skills) &&
            project.metadata.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.metadata.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          {(project.metadata.website || project.metadata.github) && (
            <div className="flex flex-wrap items-center gap-2">
              {project.metadata.website && (
                <ProjectLinkButton href={project.metadata.website} type="website" />
              )}
              {project.metadata.github && (
                <ProjectLinkButton href={project.metadata.github} type="github" />
              )}
            </div>
          )}
        </div>
        {project.type === 'notebook' && project.notebookData ? (
          <article className="prose max-w-none">
            <JupyterNotebookViewer notebook={project.notebookData} />
          </article>
        ) : (
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: project.source }}
          ></article>
        )}
      </BlurFade>
    </section>
  );
}
