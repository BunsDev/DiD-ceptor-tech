import { Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { contractName } from "@/deploy/00_deploy_gateway";

export async function getConsumer(hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.ethers.getNamedSigners();
  return hre.ethers.getContract<Contract>(contractName, deployer);
}
