import Link from "next/link";

export default function ContentCard({
  href,
  title,
  meta,
  excerptHtml,
  className,
  titleClassName,
  showReadMore = true
}: {
  href: string;
  title: string;
  meta?: string;
  excerptHtml?: string;
  className?: string;
  titleClassName?: string;
  showReadMore?: boolean;
}) {
  const thumbnailMatch = excerptHtml?.match(
    /<img[^>]*src=['"]([^'"]+)['"][^>]*>/i
  );
  const thumbnailSrc = thumbnailMatch?.[1];
  const cleanedExcerpt = thumbnailMatch
    ? excerptHtml
        ?.replace(thumbnailMatch[0], "")
        .replace(/<br\s*\/?>\s*$/i, "")
        .trim()
    : excerptHtml;

  return (
    <article
      className={`content-card group flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white/80 p-5 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg ${className ?? ""}`}
    >
      {thumbnailSrc ? (
        <div className="content-card__media">
          <img src={thumbnailSrc} alt={title} loading="lazy" />
        </div>
      ) : null}
      <div className="space-y-3">
        <h3
          className={`font-display text-lg font-semibold text-ink group-hover:text-accent ${titleClassName ?? ""}`}
        >
          <Link href={href} className="content-card__title text-ink hover:text-accent">
            {title}
          </Link>
        </h3>
        {meta ? <p className="text-xs uppercase tracking-wide text-ink/50">{meta}</p> : null}
        {cleanedExcerpt ? (
          <div
            className="excerpt-content text-sm text-ink/70"
            dangerouslySetInnerHTML={{ __html: cleanedExcerpt }}
          />
        ) : null}
      </div>
      {showReadMore ? (
        <Link href={href} className="mt-6 text-sm text-accent">
          Read more
        </Link>
      ) : null}
    </article>
  );
}
