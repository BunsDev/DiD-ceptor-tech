import { task } from "hardhat/config";

import { createSubscriptions } from "..";

import { scriptsToDeploy, upsertScripts } from "@/functions";
import { getConsumer, registerScripts } from "@/scripts/gateway";

task("upsert-gateway-requests", "Creates and optionally fund subscriptions for scripts. Register requests in Gateway.")
  .addFlag("fund", "Fund subscriptions")
  .setAction(async (params, hre) => {
    const { deployer } = await hre.getNamedAccounts();
    console.log(`Deployer: ${deployer} | `, params);

    const chainId = await hre.getChainId();
    const isLocal = chainId === hre.config.networks.hardhat.chainId.toString();
    const fund = !isLocal && params.fund;

    const consumer = await getConsumer(hre);
    const consumerAddress = await consumer.getAddress();

    const scripts = await scriptsToDeploy(chainId, consumerAddress, isLocal);
    if (!scripts.length) return console.log("No scripts to deploy.");

    console.log(`Creating ${scripts.length} subscriptions...`);
    const scriptsToRegister = await createSubscriptions(hre, consumerAddress, scripts, fund, isLocal);
    console.log(`Updating #${scriptsToRegister.length} registries in scripts map | Subscription ids`);
    await upsertScripts(scriptsToRegister, chainId);

    console.log("Registering scripts in Gateway to be used in the DON...");
    const scriptsToUpsert = await registerScripts(scriptsToRegister, consumer);

    console.log(`Updating #${scriptsToUpsert.length} registries in scripts map | Consumer ids`);
    await upsertScripts(scriptsToUpsert, chainId);

    console.log("Subscriptions created in DON and scripts registered in Gateway!");
  });
