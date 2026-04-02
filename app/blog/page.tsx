import CollectionPage from "@/components/CollectionPage";
import { getPosts } from "@/lib/content";

export default function BlogPage() {
  return (
    <CollectionPage
      title="Blog"
      subtitle="Writing, reflections, and quick logs."
      items={getPosts()}
      hrefBase="/blog"
    />
  );
}
