import Link from "next/link";
import Section from "../../../components/Section";
import { getProjects, getItemBySlug } from "../../../lib/content";
import { renderMarkdown } from "../../../lib/markdown";
import { formatDate } from "../../../lib/format";

export async function generateStaticParams() {
  return getProjects().map((item) => ({ slug: item.slug }));
}

export default async function ProjectDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const project = getItemBySlug(getProjects(), params.slug);
  if (!project) {
    return (
      <Section title="Project not found">
        <p>We could not find this project.</p>
      </Section>
    );
  }

  const html = await renderMarkdown(project.content);

  return (
    <Section title={project.title} subtitle={formatDate(project.date)}>
      <div className="experience-content">
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
        <Link href="/projects" className="mt-8 inline-flex text-sm font-medium">
          Back to projects
        </Link>
      </div>
    </Section>
  );
}
