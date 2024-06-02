import { HardhatUserConfig, HttpNetworkUserConfig, NetworksUserConfig, NetworkUserConfig } from "hardhat/types";

export interface ChainLinkContractsConfig {
  token: string;
}

export interface ChainLinkFunctionsConfig {
  donId: { onChain: string; offChain: string };
  router: string;
  secretsUploadEndpoints: string[];
}

export type ChainLinkNetworkUserConfig = HttpNetworkUserConfig & {
  contracts: ChainLinkContractsConfig;
  functions: ChainLinkFunctionsConfig;
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
