const withBuilderDevTools = require("@builder.io/dev-tools/next")();
// @ts-check
const { MONGO_CONN_STR, MONGO_DB_NAME } = process.env;

/** @type {import('next').NextConfig} */
const nextConfig = withBuilderDevTools({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  serverRuntimeConfig: {
    providerConfig: {
      networks: [
        { name: "mainnet", rpcUrl: "https://eth.drpc.org" },
        { name: "sepolia", rpcUrl: "https://sepolia.drpc.org", registry: "0x03d5003bf0e79c5f5223588f347eba39afbc3818" },
      ],
    },
    mongoConfig: {
      connectionStr: MONGO_CONN_STR,
      db: MONGO_DB_NAME,
    },
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
});

module.exports = nextConfig;
