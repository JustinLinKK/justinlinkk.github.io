import Link from "next/link";
import Section from "@/components/Section";
import { getPosts, getItemBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  return getPosts().map((item) => ({ slug: item.slug }));
}

export default async function BlogDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const post = getItemBySlug(getPosts(), params.slug);
  if (!post) {
    return (
      <Section title="Post not found">
        <p>We could not find this post.</p>
      </Section>
    );
  }

  const html = await renderMarkdown(post.content);

  return (
    <Section title={post.title} subtitle={formatDate(post.date)}>
      <div className="experience-content">
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
        <Link href="/blog" className="mt-8 inline-flex text-sm font-medium">
          Back to blog
        </Link>
      </div>
    </Section>
  );
}
