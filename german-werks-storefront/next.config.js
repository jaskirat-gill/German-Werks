const { withNextVideo } = require('next-video/process');

const { withStoreConfig } = require("./store-config");
const store = require("./store.config.json");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withStoreConfig({
  features: store.features,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname:"germanwerks.s3.us-east-2.amazonaws.com", // CHANGE IF NEEDED
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  }
});

console.log("next.config.js", JSON.stringify(nextConfig, null, 2));

module.exports = withNextVideo(nextConfig);
