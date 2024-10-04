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
        hostname:"german-werks.s3.us-east-1.amazonaws.com", // CHANGE IF NEEDED
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {  
    serverComponentsExternalPackages: [  
      "@medusajs/product",  
      "@medusajs/pricing",  
    ],  
  },  
});

console.log("next.config.js", JSON.stringify(nextConfig, null, 2));

module.exports = withNextVideo(nextConfig);
