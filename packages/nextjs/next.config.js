// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
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
          { name: "sepolia", rpcUrl: "https://sepolia.drpc.org", registry: "0x03d5003bf0e79c5f5223588f347eba39afbc3818" }
      ]
    },
    mongoConfig: {
      connectionStr: "mongodb+srv://verinta:BFWmxukoOsNdIx4x@ceptorclub.rq4oohp.mongodb.net/",
      DB: "CeptorClub_allan"
    }
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
