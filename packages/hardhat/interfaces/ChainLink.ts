import { HardhatUserConfig, HttpNetworkUserConfig, NetworksUserConfig, NetworkUserConfig } from "hardhat/types";

export interface ChainLinkContractsConfig {
  token: string;
}

export interface ChainLinkFunctionsConfig {
  donId: { onChain: string; offChain: string };
  router: string;
  secretsUploadEndpoints: string[];
}

interface PriceFeed {
  pair: string;
  address: string;
}
export interface DataFeedConfig {
  price: {
    native: PriceFeed;
    [key: string]: PriceFeed;
  };
}

export type ChainLinkNetworkUserConfig = HttpNetworkUserConfig & {
  contracts: ChainLinkContractsConfig;
  functions: ChainLinkFunctionsConfig;
  feeds: DataFeedConfig;
};

export type ChainLinkNetworksUserConfig = Pick<NetworksUserConfig, "hardhat"> & {
  [networkName: string]: NetworkUserConfig | ChainLinkNetworkUserConfig;
};

export type ChainLinkUserConfig = Omit<HardhatUserConfig, "networks"> & {
  networks?: ChainLinkNetworksUserConfig;
};

export interface DONSecret {
  ttl: number; // time to live in minutes
  secrets: Record<string, string>;
}
