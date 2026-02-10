# Development, Testing, and Production Deploy

## Blog Generation Workflow

The blog is sourced from markdown files in `content/posts`. Each time you add or edit a post:

1. Ensure the front matter includes `title` and `date`. Add `draft: true` to keep a note private.
2. Install dependencies once per environment:
   ```bash
   yarn install
   ```
3. Convert markdown into the static HTML under `blog/`:
   ```bash
   yarn generate:blog
   ```
4. Commit both the markdown and the generated HTML so GitHub Pages stays in sync.
  5. Future-dated posts are hidden automatically; export `INCLUDE_FUTURE=true` if you need to preview them locally.

## Development (Local)

- Generate the blog (steps above) whenever markdown changes.
- Serve the static site from the repo root:
  ```bash
  npx serve . -l 3000
  ```
- Navigate to http://localhost:3000 and click through `/blog` + the individual posts.

## Testing / Validation

- Regenerate after every edit (use `INCLUDE_FUTURE=true yarn generate:blog` if you need to surface scheduled posts temporarily):
  ```bash
  yarn generate:blog
  ```
- Smoke-test the exact files that GitHub Pages will host:
  ```bash
  npx serve . -l 4000
  ```

## Production Deploy (GitHub Pages)

### One-time setup

- Ensure GitHub Pages is configured:
  - Repo Settings -> Pages
  - Source: Deploy from a branch
  - Branch: gh-pages / (root)

### Manual deploy steps

1. Update markdown and run `yarn generate:blog`.
2. Commit the updated `content/` + `blog/` directories on `production-pages` (or your working branch) and push. If GitHub Pages already reads from that branch, you are finished.
3. To continue using a separate `gh-pages` branch, mirror the working tree into a temporary directory and force-push:
  ```bash
  tmp_dir=$(mktemp -d)
  rsync -av --delete --exclude '.git' ./ "$tmp_dir/"
  git checkout --orphan gh-pages
  git rm -rf .
  rsync -av "$tmp_dir/" ./
  touch .nojekyll
  git add .
  git commit -m "Deploy to GitHub Pages"
  git push -u origin gh-pages --force
  git checkout production-pages
  rm -rf "$tmp_dir"
  ```

### Notes

- The deployed site URL:
  - https://justinlinkk.github.io/
- Always run `yarn generate:blog` before publishing so the static HTML matches the markdown.
