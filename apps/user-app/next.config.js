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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://apis.google.com",
              "script-src-elem 'self' 'unsafe-inline' https://apis.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://apis.google.com",
              "frame-src 'self' https://apis.google.com",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "object-src 'none'"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig
