# Justin Lin — Portfolio & Notes

This repo hosts Justin Lin's personal site (projects, experience, and research notes). Pages are pre-rendered so the content at `blog/`, `projects/`, etc. can be served directly by GitHub Pages.

## Tech Stack

- **Static site output** copied from a Next.js/Tailwind build
- **Markdown note workflow** powered by `gray-matter` + `markdown-it`
- **Node tooling** (Yarn v1) for deterministic generation
- **date-fns** for consistent formatting
- **GitHub Pages** for hosting

## Content Workflow

1. Add or edit markdown files under `content/posts`. Include `title`, `date`, optional tags, and set `draft: true` to keep a note private.
2. Generate or refresh the static HTML:
   ```bash
   yarn install           # first time only
   yarn generate:blog
   ```
   Use `INCLUDE_FUTURE=true yarn generate:blog` if you want future-dated posts to appear locally.
3. Commit the modified `content/` and generated `blog/` artifacts.

## Local Preview / Testing

The repo already contains the production-ready HTML, so you only need a static server:

```bash
npx serve . -l 3000
# or: python3 -m http.server 3000
```

Visit <http://localhost:3000> and click through `/blog`, `/projects`, `/tech-gallery`, etc. Re-run `yarn generate:blog` after every markdown change, then refresh the browser.

## Deployment

The site can be deployed via either:

1. **Direct branch hosting** – push the updated `production-pages` branch to deploy live. GitHub Pages serves the files as-is.
2. **Test branch workflow** – use the `test-pages` branch for local testing and content development. After running `yarn generate:blog`, commit changes to `test-pages` for preview before merging to `production-pages`.

Remember to keep `.gitignore` entries (e.g., `node_modules`, `.next`, `.turbo`) untouched so transient build files never reach the repo.

## Summary

- Markdown lives in `content/`; generated HTML sits in `blog/`.
- `yarn generate:blog` is the single source of truth for syncing the two.
- Local testing = static server + browser.
- Deployment is a plain git push because all assets are already baked.

Refer to [`docs/deploy.md`](docs/deploy.md) for deeper notes on automation, future-dated posts, and manual `gh-pages` publishing.
