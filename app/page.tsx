import Link from "next/link";
import ClusterStatus from "@/components/ClusterStatus";
import ContentGrid from "@/components/ContentGrid";
import Section from "@/components/Section";
import { getPageContent, getPosts, getProjects, getTechGallery } from "@/lib/content";
import {
  featuredHardwareProjectSlugs,
  featuredSoftwareProjectSlugs,
  resolveFeaturedProjects
} from "@/lib/homepage-projects";
import { renderMarkdown } from "@/lib/markdown";

export default async function HomePage() {
  const about = getPageContent("about");
  const aboutHtml = about ? await renderMarkdown(about.content) : "";

  const projects = getProjects();
  const hardwareProjects = resolveFeaturedProjects(
    projects,
    featuredHardwareProjectSlugs,
    "hardware"
  );
  const softwareProjects = resolveFeaturedProjects(
    projects,
    featuredSoftwareProjectSlugs,
    "software"
  );
  const techGallery = getTechGallery().slice(0, 4);
  const posts = getPosts().slice(0, 5);

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
        title="Featured Hardware Projects"
        subtitle="Hardware acceleration, embedded systems and physical integration."
      >
        <ContentGrid
          items={hardwareProjects}
          hrefBase="/projects"
          columnsClassName="md:grid-cols-2"
        />
        <Link
          href="/projects"
          className="mt-6 inline-flex rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-accent/40 hover:text-accent"
        >
          Show more
        </Link>
      </Section>

      <Section
        title="Featured Software Projects"
        subtitle="AI systems, simulations, robotics software and infrastructure."
      >
        <ContentGrid
          items={softwareProjects}
          hrefBase="/projects"
          columnsClassName="md:grid-cols-2"
        />
        <Link
          href="/projects"
          className="mt-6 inline-flex rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-accent/40 hover:text-accent"
        >
          Show more
        </Link>
      </Section>

      <Section title="Cluster Status" subtitle="Snapshot of pi-cluster health.">
        <ClusterStatus />
      </Section>

      <div className="grid items-start gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Section title="Gallery" subtitle="Photos and quick notes.">
          <ContentGrid
            items={techGallery}
            hrefBase="/tech-gallery"
            columnsClassName="sm:grid-cols-2"
            titleClassName="line-clamp-2"
            excerptClassName="home-gallery-excerpt"
            mediaClassName="h-40"
          />
        </Section>
        <Section title="Latest Writings" subtitle="Reflections, logs and writing.">
          <ContentGrid items={posts} hrefBase="/blog" showExcerpt={false} />
        </Section>
      </div>
    </div>
  );
}
