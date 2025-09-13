/**
 * Next.js configuration for static export and GitHub Pages deployment.
 *
 * This configuration enables static generation via `next export` and
 * configures the base path and asset prefix dynamically based on the
 * `BASE_PATH` environment variable. When deploying to a user/organization
 * GitHub Pages site (e.g. <username>.github.io), no base path is used. For
 * project sites (e.g. <username>.github.io/my-project) the `BASE_PATH` should
 * be set to "my-project" so that routes and assets resolve correctly.
 */

// Derive the repository base path from the environment variable. This value
// should start with a slash (e.g. '/portfolio') or be an empty string for
// root deployment. GitHub Actions in `.github/workflows/deploy.yml` will
// automatically populate BASE_PATH based on the repository name.
const repoBasePath = process.env.BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export (next export)
  output: "export",

  // Ensure Next.js does not attempt to optimize images at build time. When
  // using static export there is no Node server to serve optimized images.
  images: {
    unoptimized: true,
  },

  // Use the environment-defined base path for GitHub Pages project sites.
  basePath: repoBasePath,

  // Prefix all static assets (CSS, JS, images) with the base path so they
  // resolve correctly when deployed under a subdirectory.
  assetPrefix: repoBasePath || "",

  // Always generate trailing slashes for routes (e.g. `/about/` instead of
  // `/about`). GitHub Pages expects static files with `.html` extension and
  // trailing slashes make it easier to serve index.html files from subfolders.
  trailingSlash: true,
};

module.exports = nextConfig;
