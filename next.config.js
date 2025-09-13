/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: '', // keep empty for rishav-dev.github.io
};
module.exports = nextConfig;
