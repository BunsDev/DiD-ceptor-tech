import { formatEther } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

import { getManager } from "./utils";
import { getDistributionAmount } from "../balance";

export async function fundSubscription(
  hre: HardhatRuntimeEnvironment,
  subscriptionId: string | number,
  scripts: bigint,
) {
  const amount = await getDistributionAmount(hre, scripts);
  const manager = await getManager(hre);

  await manager.fundSubscription({
    subscriptionId,
    juelsAmount: amount.toString(),
  });

  console.log(`Subscription ${subscriptionId} funded with ${formatEther(amount)} LINK.`);
}
