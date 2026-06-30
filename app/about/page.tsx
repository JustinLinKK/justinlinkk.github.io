import Link from "next/link";
import Section from "@/components/Section";
import { getPageContent } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";

export const metadata = {
  title: "About | Justin Lin",
  description: "The longer story behind Justin Lin's AI, robotics, and hardware systems work."
};

export default async function AboutPage() {
  const about = getPageContent("about-story");
  const aboutHtml = about ? await renderMarkdown(about.content) : "";

  return (
    <Section
      title="About"
      subtitle="The longer story behind my software, AI, robotics, and hardware work."
    >
      <div className="content-collection">
        <div
          className="prose-content mx-auto max-w-3xl"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap gap-3">
          <Link
            href="/experience"
            className="inline-flex rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-accent/40 hover:text-accent"
          >
            See experience
          </Link>
          <Link
            href="/projects"
            className="inline-flex rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-accent/40 hover:text-accent"
          >
            Browse projects
          </Link>
        </div>
      </div>
    </Section>
  );
}
