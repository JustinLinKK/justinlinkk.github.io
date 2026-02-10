#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const { format } = require('date-fns');

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'posts');
const BLOG_DIR = path.join(ROOT, 'blog');
const CSS_BUNDLE = '/_next/static/css/d62a59e392fb9050.css';
const SITE_TITLE = 'Justin Lin | Portfolio';
const SITE_DESCRIPTION = 'End-to-end systems across software and hardware.';
const md = new MarkdownIt({ html: false, linkify: true, typographer: true, breaks: true });
const INCLUDE_FUTURE = process.env.INCLUDE_FUTURE === 'true';

async function main() {
  const posts = await loadPosts();
  await fs.mkdir(BLOG_DIR, { recursive: true });

  await Promise.all(posts.map(writePostPage));
  await pruneOrphanPostDirs(posts.map((post) => post.slug));
  await writeIndexPage(posts);
  await writeIndexManifest(posts);

  console.log(`Generated ${posts.length} post page${posts.length === 1 ? '' : 's'}.`);
}

async function loadPosts() {
  let files;
  try {
    files = await fs.readdir(CONTENT_DIR);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('Missing content/posts directory.');
    }
    throw err;
  }

  const entries = [];
  const now = new Date();

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const filePath = path.join(CONTENT_DIR, file);
    const slug = file.replace(/\.md$/, '');
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(raw);
    const data = parsed.data || {};
    if (data.draft === true) {
      console.log(`Skipping draft: ${slug}`);
      continue;
    }
    if (!data.title) {
      throw new Error(`Missing title in ${file}`);
    }

    const date = coerceDate(data.date, filePath);
    if (!INCLUDE_FUTURE && date > now) {
      console.log(`Skipping future-dated post (set INCLUDE_FUTURE=true to include): ${slug}`);
      continue;
    }

    const formattedDate = format(date, 'MMM dd, yyyy');
    const contentHtml = md.render(parsed.content.trim());
    const summary = buildSummary(data.description, parsed.content);

    entries.push({
      slug,
      title: data.title,
      isoDate: date.toISOString(),
      formattedDate,
      tags: Array.isArray(data.tags) ? data.tags : [],
      contentHtml,
      summary,
    });
  }

  entries.sort((a, b) => (a.isoDate > b.isoDate ? -1 : 1));
  return entries;
}

function coerceDate(dateValue, fallbackPath) {
  if (dateValue) {
    const parsed = new Date(dateValue);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed;
    }
  }
  return new Date();
}

function buildSummary(description, rawContent) {
  if (description && typeof description === 'string') {
    return description.trim();
  }
  const firstLine = rawContent
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0);
  if (!firstLine) {
    return 'Personal note.';
  }
  const clean = firstLine.replace(/[`*_#>\[\]]/g, '');
  return clean.length > 160 ? `${clean.slice(0, 157)}...` : clean;
}

async function writePostPage(post) {
  const dir = path.join(BLOG_DIR, post.slug);
  await fs.mkdir(dir, { recursive: true });
  const html = renderShell({
    pageTitle: `${post.title} | Justin Lin`,
    description: post.summary,
    body: renderPostBody(post),
  });
  await fs.writeFile(path.join(dir, 'index.html'), html, 'utf-8');
  await fs.writeFile(
    path.join(dir, 'index.txt'),
    JSON.stringify({
      title: post.title,
      date: post.isoDate,
      summary: post.summary,
      tags: post.tags,
      path: `/blog/${post.slug}/`,
    }, null, 2),
    'utf-8',
  );
}

async function writeIndexPage(posts) {
  const html = renderShell({
    pageTitle: 'Blog | Justin Lin',
    description: 'Writing, reflections, and quick logs.',
    body: renderIndexBody(posts),
  });
  await fs.writeFile(path.join(BLOG_DIR, 'index.html'), html, 'utf-8');
}

async function writeIndexManifest(posts) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    total: posts.length,
    posts: posts.map((post) => ({
      title: post.title,
      date: post.isoDate,
      summary: post.summary,
      slug: post.slug,
      tags: post.tags,
      path: `/blog/${post.slug}/`,
    })),
  };
  await fs.writeFile(path.join(BLOG_DIR, 'index.txt'), JSON.stringify(manifest, null, 2), 'utf-8');
}

function renderShell({ pageTitle, description, body }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description || SITE_DESCRIPTION)}" />
    <link rel="stylesheet" href="${CSS_BUNDLE}" />
  </head>
  <body>
    <div data-overlay-container="true">
      ${renderHeader()}
      <main class="mx-auto w-full max-w-[1400px] px-6 pb-20 pt-6">
        ${body}
      </main>
      ${renderFooter()}
    </div>
  </body>
</html>`;
}

function renderHeader() {
  return `<header class="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-6">
  <a class="font-display text-[1.6rem] tracking-tight" href="/">Justin Lin</a>
  <nav class="hidden flex-1 justify-end gap-10 text-[1.4rem] font-medium md:flex">
    <a class="hover:text-accent" href="/projects/">Projects</a>
    <a class="hover:text-accent" href="/experience/">Experience</a>
    <a class="hover:text-accent" href="/tech-gallery/">Tech Gallery</a>
    <a class="hover:text-accent" href="/blog/">Blog</a>
    <a class="hover:text-accent" href="/cv/">CV</a>
  </nav>
  <div class="md:hidden text-sm">Menu</div>
</header>`;
}

function renderFooter() {
  return `<footer class="mx-auto w-full max-w-7xl px-6 pb-12 pt-16 text-sm text-ink/70">
  <div class="flex flex-col gap-3 border-t border-ink/10 pt-6 md:flex-row md:items-center md:justify-between">
    <p>Built with static generation.</p>
    <p>Last updated ${new Date().getFullYear()}.</p>
  </div>
</footer>`;
}

function renderIndexBody(posts) {
  if (!posts.length) {
    return `<section class="rounded-3xl border border-ink/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(13,15,22,0.4)] backdrop-blur">
  <div class="mb-6">
    <h2 class="font-display text-2xl font-semibold text-ink">Blog</h2>
    <p class="mt-2 max-w-2xl text-sm text-ink/70">No published notes yet. Add markdown files to content/posts.</p>
  </div>
</section>`;
  }

  const cards = posts
    .map((post) => `<article class="group flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white/80 p-5 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
    <div class="space-y-3">
      <h3 class="font-display text-lg font-semibold text-ink group-hover:text-accent">
        <a href="/blog/${post.slug}/">${escapeHtml(post.title)}</a>
      </h3>
      <p class="text-xs uppercase tracking-wide text-ink/50">${escapeHtml(post.formattedDate)}</p>
      <p class="text-sm text-ink/70">${escapeHtml(post.summary)}</p>
    </div>
    <div class="mt-6 text-sm text-accent">Read more</div>
  </article>`)
    .join('\n');

  return `<section class="rounded-3xl border border-ink/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(13,15,22,0.4)] backdrop-blur">
  <div class="mb-6">
    <h2 class="font-display text-2xl font-semibold text-ink">Blog</h2>
    <p class="mt-2 max-w-2xl text-sm text-ink/70">Writing, reflections, and quick logs.</p>
  </div>
  <div class="grid gap-4 md:grid-cols-2">
    ${cards}
  </div>
</section>`;
}

function renderPostBody(post) {
  return `<section class="rounded-3xl border border-ink/10 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(13,15,22,0.4)] backdrop-blur">
  <div class="mb-6">
    <h2 class="font-display text-2xl font-semibold text-ink">${escapeHtml(post.title)}</h2>
    <p class="mt-2 max-w-2xl text-sm text-ink/70">${escapeHtml(post.formattedDate)}</p>
  </div>
  <div class="prose-content">${post.contentHtml}</div>
  <a class="mt-8 inline-flex text-sm font-medium" href="/blog/">Back to blog</a>
</section>`;
}

async function pruneOrphanPostDirs(validSlugs) {
  const keep = new Set(validSlugs);
  let entries = [];
  try {
    entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }

  const removals = entries
    .filter((entry) => entry.isDirectory() && !keep.has(entry.name))
    .map(async (entry) => {
      try {
        await fs.access(path.join(BLOG_DIR, entry.name, 'index.txt'));
      } catch {
        return null;
      }
      await fs.rm(path.join(BLOG_DIR, entry.name), { recursive: true, force: true });
      console.log(`Removed unpublished post directory: ${entry.name}`);
      return null;
    });

  await Promise.all(removals);
}

function escapeHtml(value) {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
