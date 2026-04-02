import fs from "fs";
import path from "path";
import { load } from "cheerio";
import matter from "gray-matter";

export type ContentItem = {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  excerptHtml?: string;
  thumbnailSrc?: string;
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

const allowedExcerptTags = new Set(["a", "b", "br", "code", "em", "i", "p", "span", "strong"]);

function isSafeHref(value?: string) {
  if (!value) {
    return false;
  }

  return /^(https?:|mailto:|\/|#)/i.test(value);
}

function isSafeImageSrc(value?: string) {
  if (!value) {
    return false;
  }

  return /^(https?:|\/)/i.test(value);
}

function normalizeExcerpt(excerpt?: string) {
  if (!excerpt) {
    return { excerptHtml: undefined, thumbnailSrc: undefined };
  }

  const $ = load(`<div data-excerpt-root>${excerpt}</div>`, null, false);
  const root = $("[data-excerpt-root]").first();

  const thumbnailSrcCandidate = root.find("img").first().attr("src");
  const thumbnailSrc = isSafeImageSrc(thumbnailSrcCandidate)
    ? thumbnailSrcCandidate
    : undefined;

  root.find("img,script,style,iframe,object,embed,link,meta").remove();

  root.find("*").each((_, element) => {
    const tagName = element.tagName?.toLowerCase();

    if (!tagName) {
      return;
    }

    const node = $(element);

    if (!allowedExcerptTags.has(tagName)) {
      node.replaceWith(node.contents());
      return;
    }

    const href = tagName === "a" ? element.attribs?.href : undefined;
    const attributes = Object.keys(element.attribs ?? {});
    for (const attribute of attributes) {
      node.removeAttr(attribute);
    }

    if (tagName === "a") {
      if (!isSafeHref(href)) {
        node.replaceWith(node.contents());
        return;
      }

      node.attr("href", href);
      node.attr("rel", "noreferrer");
      node.attr("target", "_blank");
    }
  });

  const excerptHtml = root.html()?.replace(/(<br\s*\/?>\s*)+$/i, "").trim() || undefined;

  return { excerptHtml, thumbnailSrc };
}

function readContentFile(filePath: string): ContentItem {
  const file = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(file);
  const slug = path.basename(filePath, path.extname(filePath));
  const excerpt = data.excerpt ? String(data.excerpt) : undefined;
  const { excerptHtml, thumbnailSrc } = normalizeExcerpt(excerpt);

  return {
    slug,
    title: String(data.title || slug),
    date: data.date ? String(data.date) : undefined,
    excerpt,
    excerptHtml,
    thumbnailSrc,
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
