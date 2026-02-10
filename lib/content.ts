import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ContentItem = {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  collection?: string;
  draft?: boolean;
  content: string;
};

const PROJECTS_DIR = "content/projects";
const TECH_GALLERY_DIR = "content/tech-gallery";
const POSTS_DIR = "content/posts";
const PAGES_DIR = "content/pages";

const supportedExtensions = [".md", ".markdown", ".mkd", ".html"];

function isSupported(filename: string) {
  return supportedExtensions.includes(path.extname(filename));
}

function readContentFile(filePath: string): ContentItem {
  const file = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(file);
  const slug = path.basename(filePath, path.extname(filePath));

  return {
    slug,
    title: String(data.title || slug),
    date: data.date ? String(data.date) : undefined,
    excerpt: data.excerpt ? String(data.excerpt) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    collection: data.collection ? String(data.collection) : undefined,
    draft: data.draft === true,
    content
  };
}

function readDirectoryContent(dir: string): ContentItem[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter(isSupported)
    .map((filename) => readContentFile(path.join(dir, filename)))
    .filter((item) => !item.draft)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getProjects() {
  return readDirectoryContent(path.join(process.cwd(), PROJECTS_DIR));
}

export function getTechGallery() {
  return readDirectoryContent(path.join(process.cwd(), TECH_GALLERY_DIR));
}

export function getPosts() {
  return readDirectoryContent(path.join(process.cwd(), POSTS_DIR));
}

export function getPageContent(slug: string) {
  const pagePath = path.join(process.cwd(), PAGES_DIR, `${slug}.md`);
  if (!fs.existsSync(pagePath)) {
    return null;
  }
  return readContentFile(pagePath);
}

export function getItemBySlug(items: ContentItem[], slug: string) {
  return items.find((item) => item.slug === slug) ?? null;
}
