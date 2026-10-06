import type { NextConfig } from 'next';

const githubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: githubPages ? 'export' : 'standalone',
  basePath: githubPages ? process.env.PAGES_BASE_PATH ?? '' : '',
  trailingSlash: githubPages,
  images: { unoptimized: githubPages },
};

export default nextConfig;
