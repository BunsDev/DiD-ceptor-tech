import { task } from "hardhat/config";
import { ZeroAddress } from "ethers";
import { providers } from "ethers@v5";

import { buildSecretsReference } from "../manage";

import { getSecret } from "@/secrets";
import { getConsumer, registerScripts } from "@/scripts/gateway";
import { upsertScripts, scriptsToDeploy } from "@/functions";
import { targetNetworks } from "@/ceptor.config";

task("update-secrets", "Upload secrets.")
  .addOptionalParam("chain", "The chain id to update secrets.")
  .setAction(async (params, hre) => {
    const chainId = params.chain || (await hre.getChainId());
    const isLocal = chainId === hre.config.networks.hardhat.chainId.toString();
    const scripts = await scriptsToDeploy(chainId, ZeroAddress, isLocal); // ZeroAddress to force all the registered scripts.
    const gateway = await getConsumer(hre);

    for (const script of scripts) {
      const { name } = script;

      console.log("updating secrets for:", name);
      const secret = await getSecret(name);
      const validUntil = Date.now() + secret.ttl * 60 * 1000;

      const reference = await buildSecretsReference(hre, secret);

      console.log("encrypted secrets reference:", reference);
      script.secret = { reference, validUntil };
    }

    const scriptsToUpsert = await registerScripts(scripts, gateway);
    await upsertScripts(scriptsToUpsert, chainId);
  });

task("update-secrets:all", "Upload secrets for all networks.").setAction(async (params, hre) => {
  const networks: any = targetNetworks(hre);
  for (const { url } of networks) {
    const provider = new providers.JsonRpcProvider(url);
    const { chainId } = await provider.getNetwork();
    console.log("updating secrets for chain:", { chainId });

    // TODO: Inject provider to make the tasks have the context network loaded.
    // await hre.run("update-secrets", { chain: chainId.toString() });
  }
});
