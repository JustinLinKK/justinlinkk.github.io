import Section from "../../components/Section";
import ContentCard from "../../components/ContentCard";
import { getTechGallery } from "../../lib/content";
import { formatDate } from "../../lib/format";

export default function TechGalleryPage() {
  const items = getTechGallery();

  return (
    <Section title="Gallery" subtitle="Snapshots of hardware, experiments, and prototypes.">
      <div className="experience-content">
        <div className="experience-grid md:grid-cols-2">
          {items.map((item) => (
            <ContentCard
              key={item.slug}
              href={`/tech-gallery/${item.slug}`}
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
