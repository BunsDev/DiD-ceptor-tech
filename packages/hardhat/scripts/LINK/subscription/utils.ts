// Load all the scripts and verify with the mapper which are not yet deployed.
//  return the ones that are not yet deployed or need update.

import { Contract } from "ethers";
import { SubscriptionManager } from "@chainlink/functions-toolkit";

import { getNetworkConfig } from "../utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const consumerContractName = "CCGateway";
let subscriptionManager: SubscriptionManager;

export async function getManager(hre: HardhatRuntimeEnvironment) {
  if (subscriptionManager) return subscriptionManager;

  const {
    contracts: { token: linkTokenAddress },
    functions: { router: functionsRouterAddress },
  } = await getNetworkConfig(hre);
  const signer = await hre.ethers.getNamedSigner("deployer");

  subscriptionManager = new SubscriptionManager({
    signer,
    linkTokenAddress,
    functionsRouterAddress,
  });
  await subscriptionManager.initialize();

  return subscriptionManager;
}

export async function getConsumer(hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.ethers.getNamedSigners();
  return hre.ethers.getContract<Contract>(consumerContractName, deployer);
}
