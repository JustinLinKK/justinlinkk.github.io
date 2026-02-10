# Justin Lin — Portfolio & Notes

This repo hosts Justin Lin's personal site (projects, experience, and research notes). Pages are pre-rendered so the content at `blog/`, `projects/`, etc. can be served directly by GitHub Pages.

## Tech Stack

- **Static site output** copied from a Next.js/Tailwind build
- **Markdown note workflow** powered by `gray-matter` + `markdown-it`
- **Node tooling** (Yarn v1) for deterministic generation
- **date-fns** for consistent formatting
- **GitHub Pages** for hosting

## Setup & Content workflow

- **Setup (first time):** install dependencies with `yarn install` (or `npm ci` for CI). Use a recent Node LTS (Node 18+ recommended).

- **Edit content:** add or edit Markdown files under `content/posts`.
   - Frontmatter: include `title`, `date` (ISO 8601 recommended), optional `tags` (array), and `draft: true` to keep a note private.
   - Filename guidance: use `YYYY-MM-DD-my-post.md` for clarity, though the generator reads frontmatter first.

- **Generate static output:** run:
   ```bash
   yarn generate:blog
   ```
   - To include future-dated posts locally, run:
   ```bash
   INCLUDE_FUTURE=true yarn generate:blog
   ```
   - The command reads `content/` and writes generated HTML into the `blog/` folder.

- **Preview locally:** serve the repository root and open http://localhost:3000:
   ```bash
   npx serve . -l 3000
   # or: python3 -m http.server 3000
   ```

- **Workflow notes:**
   - Re-run `yarn generate:blog` after every markdown change before refreshing the browser.
   - Keep private drafts by setting `draft: true`; unset it to publish.
   - Commit both your edited `content/` files and the generated `blog/` artifacts when you want the site output included in the repo.

Visit `/blog`, `/projects`, `/tech-gallery`, etc. after serving to verify pages.

## Deployment

The site can be deployed via my **pi-clusterv2** 

## Summary

- Markdown lives in `content/`; generated HTML sits in `blog/`.
- `yarn generate:blog` is the single source of truth for syncing the two.
- Local testing = static server + browser.
- Deployment is a plain git push because all assets are already baked.

Refer to [`docs/deploy.md`](docs/deploy.md) for deeper notes on automation, future-dated posts, and manual `gh-pages` publishing.
