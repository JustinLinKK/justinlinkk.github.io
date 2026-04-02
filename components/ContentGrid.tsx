import ContentCard from "@/components/ContentCard";
import { formatDate } from "@/lib/format";
import { ContentItem } from "@/lib/content";

type ContentGridProps = {
  items: ContentItem[];
  hrefBase: string;
  columnsClassName?: string;
  cardClassName?: string;
  titleClassName?: string;
  showExcerpt?: boolean;
  showReadMore?: boolean;
};

export default function ContentGrid({
  items,
  hrefBase,
  columnsClassName,
  cardClassName,
  titleClassName,
  showExcerpt = true,
  showReadMore = true
}: ContentGridProps) {
  return (
    <div className={`content-grid ${columnsClassName ?? ""}`.trim()}>
      {items.map((item) => (
        <ContentCard
          key={item.slug}
          href={`${hrefBase}/${item.slug}`}
          title={item.title}
          meta={formatDate(item.date)}
          excerptHtml={showExcerpt ? item.excerptHtml : undefined}
          thumbnailSrc={item.thumbnailSrc}
          className={cardClassName}
          titleClassName={titleClassName}
          showReadMore={showReadMore}
        />
      ))}
    </div>
  );
}
