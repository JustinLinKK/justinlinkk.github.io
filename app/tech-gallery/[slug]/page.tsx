import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import { getTechGallery, getItemBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  return getTechGallery().map((item) => ({ slug: item.slug }));
}

export default async function TechGalleryDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const item = getItemBySlug(getTechGallery(), params.slug);
  if (!item) {
    return (
      <Section title="Gallery item not found">
        <p>We could not find this item.</p>
      </Section>
    );
  }

  const html = await renderMarkdown(item.content || "");

  return (
    <Section title={item.title} subtitle={formatDate(item.date)}>
      {item.thumbnailSrc ? (
        <div className="mb-8 overflow-hidden rounded-2xl border border-ink/10 bg-white/60">
          <Image
            src={item.thumbnailSrc}
            alt={item.title}
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
      ) : null}
      <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
      <Link href="/tech-gallery" className="mt-8 inline-flex text-sm font-medium">
        Back to gallery
      </Link>
    </Section>
  );
}
