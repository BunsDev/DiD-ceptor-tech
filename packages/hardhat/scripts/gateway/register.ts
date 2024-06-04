import { Location } from "@chainlink/functions-toolkit";
import { Contract, encodeBytes32String } from "ethers";

import { Script } from "@/functions";

const callbackGasLimit = 300_000;
const EMPTY_SECRET = encodeBytes32String("");

export async function registerScripts(scripts: Array<Script>, Gateway: Contract): Promise<Array<Script>> {
  const results: Array<Script> = [];
  const consumerAddress = await Gateway.getAddress();

  async function registerRequest(script: Script) {
    const { subscriptionId, source, secret, name } = script;
    const reference = secret?.reference ?? EMPTY_SECRET;

    console.log(`Registering script ${name} to be used through subscription ${subscriptionId}...`);
    const tx = await Gateway.registerRequest(
      subscriptionId,
      Location.Inline, // TODO: change to [Remote | DONHosted].
      source, // TODO: point to [repo/url (commit:hash) | DONHosted URL]
      Location.DONHosted,
      reference,
      callbackGasLimit,
      name,
    );

    await tx.wait();
    script.consumerAddress = consumerAddress;
    console.log(`Script ${name} registered. | ${tx.hash}`);

    return script;
  }

  for (const script of scripts) {
    try {
      const result = await registerRequest(script);
      results.push(result);
    } catch (error) {
      console.log(`Could not create subscription for script ${script.name} | reason: ${error}`);
    }
  }

  return results;
}

// postgres://hasura:Fq9sYdLOrhC8@ep-throbbing-wood-27919427.us-west-2.aws.neon.tech/neondb?options=project%3Dep-throbbing-wood-27919427&sslmode=require
