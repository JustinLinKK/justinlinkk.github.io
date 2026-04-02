import Link from "next/link";
import ClusterStatus from "@/components/ClusterStatus";
import ContentGrid from "@/components/ContentGrid";
import Section from "@/components/Section";
import { getPageContent, getPosts, getProjects, getTechGallery } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";

export default async function HomePage() {
  const about = getPageContent("about");
  const aboutHtml = about ? await renderMarkdown(about.content) : "";

  const projects = getProjects().slice(0, 2);
  const techGallery = getTechGallery().slice(0, 1);
  const posts = getPosts().slice(0, 3);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-ink/10 bg-white/80 p-8 shadow-xl">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-ink/50">About</p>
        <div
          className="prose-content mx-auto mt-4 max-w-3xl text-ink/80"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />
        <Link
          href="/experience"
          className="mt-6 inline-flex justify-center text-base font-semibold text-accent"
        >
          See full experience
        </Link>
      </section>

      <Section
        title="Latest Projects"
        subtitle="Build, integration and research"
      >
        <ContentGrid items={projects} hrefBase="/projects" columnsClassName="md:grid-cols-2" />
      </Section>

      <Section title="Cluster Status" subtitle="Snapshot of pi-cluster health.">
        <ClusterStatus />
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Gallery" subtitle="Photos and quick notes.">
          <ContentGrid items={techGallery} hrefBase="/tech-gallery" />
        </Section>
        <Section title="Latest Writings" subtitle="Reflections, logs and writing.">
          <ContentGrid items={posts} hrefBase="/blog" showExcerpt={false} />
        </Section>
      </div>
    </div>
  );
}
