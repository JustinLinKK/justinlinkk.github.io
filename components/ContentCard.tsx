import Image from "next/image";
import Link from "next/link";

export default function ContentCard({
  href,
  title,
  meta,
  excerptHtml,
  thumbnailSrc,
  className,
  titleClassName,
  excerptClassName,
  mediaClassName,
  showReadMore = true
}: {
  href: string;
  title: string;
  meta?: string;
  excerptHtml?: string;
  thumbnailSrc?: string;
  className?: string;
  titleClassName?: string;
  excerptClassName?: string;
  mediaClassName?: string;
  showReadMore?: boolean;
}) {
  return (
    <article
      className={`content-card group flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white/80 p-5 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg ${className ?? ""}`}
    >
      {thumbnailSrc ? (
        <div
          className={`content-card__media relative w-full overflow-hidden rounded-md ${mediaClassName ?? "h-48"}`}
        >
          <Image
            src={thumbnailSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
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
        {excerptHtml ? (
          <div
            className={`excerpt-content text-sm text-ink/70 ${excerptClassName ?? ""}`}
            dangerouslySetInnerHTML={{ __html: excerptHtml }}
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
