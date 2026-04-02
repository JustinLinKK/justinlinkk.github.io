import CollectionPage from "@/components/CollectionPage";
import { getTechGallery } from "@/lib/content";

export default function TechGalleryPage() {
  return (
    <CollectionPage
      title="Gallery"
      subtitle="Snapshots of hardware, experiments, and prototypes."
      items={getTechGallery()}
      hrefBase="/tech-gallery"
    />
  );
}
