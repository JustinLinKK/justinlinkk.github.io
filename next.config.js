/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const isUserOrOrgPage = repo.endsWith(".github.io");
const basePath = isGithubActions && !isUserOrOrgPage ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : ""
};

module.exports = nextConfig;
