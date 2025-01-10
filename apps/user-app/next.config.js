/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@repo/ui': require.resolve('@repo/ui'),
    };
    return config;
  },
};

module.exports = nextConfig
