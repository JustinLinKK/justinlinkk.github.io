import Section from "../../components/Section";
import ContentCard from "../../components/ContentCard";
import { getProjects } from "../../lib/content";
import { formatDate } from "../../lib/format";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <Section
      title="Projects"
      subtitle="Selected builds across embedded systems, AI, and hardware acceleration."
    >
      <div className="experience-content">
        <div className="experience-grid md:grid-cols-2">
          {projects.map((item: import("../../lib/content").ContentItem) => (
            <ContentCard
              key={item.slug}
              href={`/projects/${item.slug}`}
              title={item.title}
              meta={formatDate(item.date)}
              excerptHtml={item.excerpt}
              className="experience-card"
              showReadMore={false}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
