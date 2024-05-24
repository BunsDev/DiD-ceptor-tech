// Load all the scripts and verify with the mapper which are not yet deployed.
//  return the ones that are not yet deployed or need update.

import { SubscriptionManager } from "@chainlink/functions-toolkit";

import { getNetworkConfig } from "../utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

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
