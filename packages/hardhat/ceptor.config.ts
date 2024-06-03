import { HardhatRuntimeEnvironment } from "hardhat/types";

export const targetNetworks = (hre: HardhatRuntimeEnvironment) => {
  const chains = hre.config.networks;
  return [chains.optimismSepolia, chains.baseSepolia, chains.polygonAmoy, chains.sepolia, chains.hardhat];
};
