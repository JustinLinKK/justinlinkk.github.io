# Justin Lin — Portfolio & Notes

This repo hosts Justin Lin's personal site (projects, experience, and research notes). The site is built with Next.js static export and deployed to GitHub Pages.

## Tech Stack

- **Next.js static export** with Tailwind CSS
- **Markdown-backed content** powered by `gray-matter` + `markdown-it`
- **Node tooling** (Yarn v1)
- **date-fns** for consistent formatting
- **GitHub Pages** for hosting

## Setup & Content workflow

- **Setup (first time):** install dependencies with `yarn install` (or `npm ci` for CI). Use a recent Node LTS (Node 18+ recommended).

- **Edit content:** add or edit Markdown files under `content/posts`, `content/projects`, `content/tech-gallery`, and `content/pages` as needed.
   - Frontmatter: include `title`, `date` (ISO 8601 recommended), optional `tags` (array), and `draft: true` to keep a note private.
   - Filename guidance: use clear slug-like names such as `YYYY-MM-DD-my-post.md` for posts.

- **Run the app locally:** use:
  ```bash
  yarn dev
  ```
  Then open http://localhost:3000.

- **Create the production export:** run:
  ```bash
  yarn build
  ```
  This writes the static site to `out/`.

- **Preview locally:** serve the repository root and open http://localhost:3000:
   ```bash
   npx serve out -l 3000
   ```

- **Workflow notes:**
   - Keep private drafts by setting `draft: true`; unset it to publish.
   - Commit your source content and app changes; `out/` is generated during CI/CD and should not be committed.

Visit `/blog`, `/projects`, `/tech-gallery`, etc. after serving to verify pages.

## Deployment

The site deploys through the GitHub Pages workflow on the `production-pages` branch.

## Summary

- Site content lives in `content/`.
- Local development uses `yarn dev`.
- Production export uses `yarn build` and writes to `out/`.
- Deployment happens through GitHub Actions + GitHub Pages.

Refer to [`docs/deploy.md`](docs/deploy.md) for deployment notes.
