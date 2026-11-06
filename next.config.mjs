import { withPayload } from "@payloadcms/next/withPayload";

const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL
  ? new URL(process.env.PAYLOAD_PUBLIC_SERVER_URL)
  : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      ...(serverUrl
        ? [
            {
              protocol: serverUrl.protocol.replace(":", ""),
              hostname: serverUrl.hostname,
              ...(serverUrl.port ? { port: serverUrl.port } : {}),
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
