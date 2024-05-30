import { Address } from "hardhat-deploy/dist/types";

import { getManager } from "./utils";
import { fundSubscription } from "./fund";
import { Script } from "@/functions";
import { HardhatRuntimeEnvironment } from "hardhat/types";

async function addConsumer(hre: HardhatRuntimeEnvironment, subscriptionId: number, consumerAddress: string) {
  const manager = await getManager(hre);

  const receipt = await manager.addConsumer({
    subscriptionId,
    consumerAddress,
  });
  console.log(`Subscription ${subscriptionId} now has ${consumerAddress} as a consumer.`);

  return receipt;
}

async function removeConsumer(hre: HardhatRuntimeEnvironment, subscriptionId: number, consumerAddress: string) {
  const manager = await getManager(hre);

  const receipt = await manager.removeConsumer({
    subscriptionId,
    consumerAddress,
  });
  console.log(`Subscription ${subscriptionId} removed ${consumerAddress} as a consumer.`);

  return receipt;
}

async function updateConsumer(
  hre: HardhatRuntimeEnvironment,
  subscriptionId: number,
  current: string,
  previous?: string,
) {
  const manager = await getManager(hre);

  const info = await manager.getSubscriptionInfo(subscriptionId);
  const result: any = { subscriptionId, info };

  if (previous && info.consumers.includes(previous))
    result.removed = await removeConsumer(hre, subscriptionId, previous);
  if (!info.consumers.includes(current)) result.added = await addConsumer(hre, subscriptionId, current);
  return result;
}

// ---------------------------------------------------------------------------------------------------------------------
export async function createSubscription(
  hre: HardhatRuntimeEnvironment,
  consumerAddress: Address,
  fund: boolean = false,
  scripts: bigint,
) {
  const manager = await getManager(hre);

  const subscriptionId = await manager.createSubscription({});
  console.log(`Subscription ${subscriptionId} created.`);

  if (fund) await fundSubscription(hre, subscriptionId, scripts);
  await addConsumer(hre, subscriptionId, consumerAddress);

  return subscriptionId;
}

// ---------------------------------------------------------------------------------------------------------------------
export async function createSubscriptions(
  hre: HardhatRuntimeEnvironment,
  consumerAddress: Address,
  scripts: Array<Script>,
  fund: boolean,
  isLocal: boolean,
): Promise<Array<Script>> {
  const results: Array<Script> = [];
  const scriptsLength = BigInt(scripts.length);
  async function createSubscriptionForScript(script: Script) {
    const { name, checksum, subscriptionId } = script;

    if (subscriptionId) {
      console.log(`Script ${name} already has a subscription ${subscriptionId} | ${checksum}`);
      if (!isLocal) {
        if (fund) await fundSubscription(hre, subscriptionId, scriptsLength);
        if (script.consumerAddress !== consumerAddress)
          await updateConsumer(hre, subscriptionId, consumerAddress, script.consumerAddress);
      }
    } else {
      script.subscriptionId = await createSubscription(hre, consumerAddress, fund, scriptsLength);
      console.log(`Subscription ${script.subscriptionId} created for script ${name} | ${checksum}`);
    }

    return script;
  }

  for (const script of scripts) {
    try {
      const result = await createSubscriptionForScript(script);
      results.push(result);
    } catch (error) {
      console.log(`Could not create subscription for script ${script.name} | reason: ${error}`);
    }
  }

  return results;
}
