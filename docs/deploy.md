# Development, Testing, and Production Deploy

## Development

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Start the local dev server:
   ```bash
   yarn dev
   ```
3. Open http://localhost:3000 and verify the relevant pages.

## Content Workflow

- Blog posts live in `content/posts`.
- Projects live in `content/projects`.
- Tech gallery entries live in `content/tech-gallery`.
- Shared pages live in `content/pages`.

Each entry is sourced directly by the Next app during build. There is no separate generated `blog/` publishing step anymore.

## Production Build Validation

To validate the same static export that GitHub Pages will deploy:

1. Build the site:
   ```bash
   yarn build
   ```
2. Preview the generated output:
   ```bash
   npx serve out -l 4000
   ```

## GitHub Pages Deployment

The repository deploys via `.github/workflows/deploy-gh-pages.yml`.

### One-time setup

- In GitHub repo settings, configure Pages to use **GitHub Actions** as the source.

### Publish flow

1. Commit your source changes to the `production-pages` branch.
2. Push that branch to GitHub.
3. The workflow will install dependencies, run `yarn build`, upload `out/`, and deploy it to GitHub Pages.

## Notes

- Deployed site URL: https://justinlinkk.github.io/
- Do not commit `.next/`, `out/`, or legacy generated site folders.
