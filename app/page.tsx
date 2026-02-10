import Link from "next/link";
import Section from "../components/Section";
import ContentCard from "../components/ContentCard";
import ClusterStatus from "../components/ClusterStatus";
import { getPageContent, getProjects, getTechGallery, getPosts } from "../lib/content";
import { renderMarkdown } from "../lib/markdown";
import { formatDate } from "../lib/format";

export default async function HomePage() {
  const about = getPageContent("about");
  const aboutHtml = about ? await renderMarkdown(about.content) : "";

  const projects = getProjects().slice(0, 2);
  const techGallery = getTechGallery().slice(0, 1);
  const posts = getPosts().slice(0, 3);
  type Project = typeof projects[number];
  type TechItem = typeof techGallery[number];
  type Post = typeof posts[number];

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
        title="Latest projects"
        subtitle="Build, integration and research"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((item: Project) => (
            <ContentCard
              key={item.slug}
              href={`/projects/${item.slug}`}
              title={item.title}
              meta={formatDate(item.date)}
              excerptHtml={item.excerpt}
            />
          ))}
        </div>
      </Section>

      <Section title="Cluster status" subtitle="Snapshot of pi-slurm health.">
        <ClusterStatus />
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Gallery" subtitle="Photos and quick notes.">
          <div className="grid gap-4">
            {techGallery.map((item: TechItem) => (
              <ContentCard
                key={item.slug}
                href={`/tech-gallery/${item.slug}`}
                title={item.title}
                meta={formatDate(item.date)}
                excerptHtml={item.excerpt}
              />
            ))}
          </div>
        </Section>
        <Section title="Latest writing" subtitle="Reflections, logs and writing.">
          <div className="grid gap-4">
            {posts.map((item: Post) => (
              <ContentCard
                key={item.slug}
                href={`/blog/${item.slug}`}
                title={item.title}
                meta={formatDate(item.date)}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
