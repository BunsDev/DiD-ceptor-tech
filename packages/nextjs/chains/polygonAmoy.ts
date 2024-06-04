import { defineChain } from "viem";

// if we want to add other chains, copy this, and import that new one into the index.ts
export const polygonAmoy = defineChain({
  id: 80_002,
  name: "Polygon Amoy",
  network: "maticamoy",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-amoy.polygon.technology"] },
    public: { http: ["https://rpc-amoy.polygon.technology"] },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://amoy.polygonscan.com/" },
    etherscan: { name: "PolygonScan", url: "https://amoy.polygonscan.com/" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 3127388,
    },
  },
  testnet: true,
});
