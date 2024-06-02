import { task } from "hardhat/config";

import { buildSecretsReference } from "../manage";
import { contractName } from "@/deploy/97_deploy_example_client";

import { getSecret } from "@/secrets";
import { getClient, getConsumer, registerScripts } from "@/scripts/gateway";
import { type ScriptsMap, loadMap, upsertScripts } from "@/functions";

task("update-secret", "Upload secrets.")
  .addOptionalParam("name", "script file name")
  .addOptionalParam("slot", "script slot id")
  .addFlag("client", "use client instead of gateway")
  .addOptionalParam("contract", "contract name", contractName)
  .addOptionalParam("address", "contract address")
  .setAction(async (params, hre) => {
    if (params.client && !params.contract && !params.address)
      throw new Error(`contract name or address is required on client mode`);

    const secret = await getSecret(params.name, params.slot);
    const chainId = await hre.getChainId();
    const scriptsMap = (await loadMap(chainId)) as ScriptsMap;

    const script = scriptsMap[secret.name];
    if (!script) throw new Error(`can't find the script in scripts map`);

    const validUntil = Date.now() + secret.ttl * 60 * 1000;
    const reference = await buildSecretsReference(hre, secret);
    console.log("encrypted secrets reference:", reference);

    script.secret = { reference, validUntil };
    if (params.client) {
      const client = await getClient(hre, params.contract, params.address);
      const tx = await client.updateEncryptedSecretsReference(reference);
      await tx.wait();
    } else {
      // Should we load the consumer from the scripts map? is currently loading the network registered deployed gateway.
      const gateway = await getConsumer(hre);
      const scripts = await registerScripts([script], gateway);
      await upsertScripts(scripts, chainId);
    }
  });
