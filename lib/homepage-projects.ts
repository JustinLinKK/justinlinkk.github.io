import type { ContentItem } from "@/lib/content";

export const FEATURED_PROJECT_LIMIT = 4;

export const featuredHardwareProjectSlugs = [
  "capstone-sandmaze",
  "2d-systolic-array-accelerator",
  "aevcar-autonomous-vehicle",
  "ti-msp432-3d-space-scanner"
] as const;

export const featuredSoftwareProjectSlugs = [
  "graph-code",
  "astra-sim-llm-serving",
  "llm-osint",
  "image-demosaicing-malvar-he-cutler"
] as const;

export function resolveFeaturedProjects(
  projects: ContentItem[],
  slugs: readonly string[],
  groupLabel: string
): ContentItem[] {
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
  const missingSlugs = slugs.filter((slug) => !projectBySlug.has(slug));

  if (missingSlugs.length > 0) {
    throw new Error(
      `Missing featured ${groupLabel} project slug(s): ${missingSlugs.join(
        ", "
      )}. Update lib/homepage-projects.ts or add matching content/projects markdown files.`
    );
  }

  return slugs
    .slice(0, FEATURED_PROJECT_LIMIT)
    .map((slug) => projectBySlug.get(slug)!);
}
