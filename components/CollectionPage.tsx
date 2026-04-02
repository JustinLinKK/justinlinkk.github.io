import Section from "@/components/Section";
import ContentGrid from "@/components/ContentGrid";
import { ContentItem } from "@/lib/content";

type CollectionPageProps = {
  title: string;
  subtitle?: string;
  items: ContentItem[];
  hrefBase: string;
};

export default function CollectionPage({
  title,
  subtitle,
  items,
  hrefBase
}: CollectionPageProps) {
  return (
    <Section title={title} subtitle={subtitle}>
      <div className="content-collection">
        <ContentGrid
          items={items}
          hrefBase={hrefBase}
          columnsClassName="md:grid-cols-2"
          showReadMore={false}
        />
      </div>
    </Section>
  );
}
