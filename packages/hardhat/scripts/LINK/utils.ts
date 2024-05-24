import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ChainLinkNetworkUserConfig } from "@/interfaces";
import { MissingContractsConfig, MissingFunctionsConfig, WrongFunctionsConfig } from "@/errors/chainlink/functions";

let networkConfig: ChainLinkNetworkUserConfig;

export async function getNetworkConfig(hre: HardhatRuntimeEnvironment): Promise<ChainLinkNetworkUserConfig> {
  if (networkConfig) return networkConfig;

  const { name, config } = hre.network;
  if (!("functions" in config)) throw new MissingFunctionsConfig(name);
  if (!("contracts" in config)) throw new MissingContractsConfig(name);

  const {
    contracts: { token },
    functions: { router },
  } = config as ChainLinkNetworkUserConfig;
  if (!token || !router) throw new WrongFunctionsConfig(name);

  return (networkConfig = config as ChainLinkNetworkUserConfig);
}
