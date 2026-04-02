import CollectionPage from "@/components/CollectionPage";
import { getProjects } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <CollectionPage
      title="Projects"
      subtitle="Selected builds across embedded systems, AI, and hardware acceleration."
      items={getProjects()}
      hrefBase="/projects"
    />
  );
}
