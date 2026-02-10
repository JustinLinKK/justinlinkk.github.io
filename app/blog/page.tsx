import Section from "@/components/Section";
import ContentCard from "@/components/ContentCard";
import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";

export default function BlogPage() {
  const posts = getPosts();

  return (
    <Section title="Blog" subtitle="Writing, reflections, and quick logs.">
      <div className="experience-content">
        <div className="experience-grid md:grid-cols-2">
          {posts.map((item) => (
            <ContentCard
              key={item.slug}
              href={`/blog/${item.slug}`}
              title={item.title}
              meta={formatDate(item.date)}
              excerptHtml={item.excerpt}
              className="experience-card"
              titleClassName="text-ink group-hover:text-ink"
              showReadMore={false}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
