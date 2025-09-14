/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true'; // set only during deploy
const repo = 'portfolio-rishav'; // <-- your repository name

export default {
  // Produce a static site 
  output: 'export',

  // Next/Image on static hosts 
  images: { unoptimized: true },

  // Avoid 404s by ensuring folders like /projects/ map to /projects/index.html
  trailingSlash: true,

  // Only set basePath/assetPrefix for GitHub Pages *project* sites
  // (username.github.io/<repo>)
  basePath: isGitHubPages ? `/${repo}` : '',
  assetPrefix: isGitHubPages ? `/${repo}/` : '',
};
