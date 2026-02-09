# Development, Testing, and Production Deploy

## Development (Local)

- Install dependencies:
  ```bash
  yarn install
  ```
- Run the dev server:
  ```bash
  yarn dev
  ```
- Open in browser:
  ```
  http://localhost:3000
  ```

## Testing / Validation

- Lint:
  ```bash
  yarn lint
  ```
- Build (static export output is in ./out):
  ```bash
  yarn build
  ```

## Production Deploy (GitHub Pages via gh-pages branch)

### One-time setup

- Ensure GitHub Pages is configured:
  - Repo Settings -> Pages
  - Source: Deploy from a branch
  - Branch: gh-pages / (root)

### Manual deploy steps

1) Build the static export:
   ```bash
   yarn install
   yarn build
   ```
2) Publish ./out to gh-pages:
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -R out/* .
   touch .nojekyll
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push -u origin gh-pages --force
   git checkout master
   ```

### Notes

- The deployed site URL:
  - https://justinlinkk.github.io/
- If you automate deployment later, keep gh-pages as the target branch.
