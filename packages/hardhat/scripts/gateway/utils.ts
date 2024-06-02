import { Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { contractName } from "@/deploy/00_deploy_gateway";

export async function getConsumer(hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.ethers.getNamedSigners();
  return hre.ethers.getContract<Contract>(contractName, deployer);
}

export async function getClientByName(hre: HardhatRuntimeEnvironment, contractName: string) {
  const { deployer } = await hre.ethers.getNamedSigners();
  return hre.ethers.getContract<Contract>(contractName, deployer);
}

export async function getClientByAddress(hre: HardhatRuntimeEnvironment, address: string) {
  if (address) throw new Error(`"getClientByAddress" not implemented`);
  return new hre.ethers.Contract(address, [], hre.ethers.provider);
}

export async function getClient(hre: HardhatRuntimeEnvironment, name: string, address: string) {
  if (address) return getClientByAddress(hre, address);
  if (name) return getClientByName(hre, name);
  throw new Error(`contract name or address is required`);
}
