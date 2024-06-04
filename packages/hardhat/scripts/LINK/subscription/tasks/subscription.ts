import { task } from "hardhat/config";
import { Contract } from "ethers";
import scriptsMap from "@/functions/link_functions_map.json";

task("update-subscription", "Upload subscription.")
  .addParam("file", "script file name")
  .addParam("contract", "smart contract name")
  .setAction(async (params, hre) => {
    const { deployer } = await hre.getNamedAccounts();
    const chainId = await hre.getChainId();
    console.log(`Deployer: ${deployer}, ChainId: ${chainId}, Contract: ${params.contract}`);

    const scripts = (<any>scriptsMap)[chainId];
    const script = scripts[params.file];

    console.log(`Update subscription id: ${script.subscriptionId}`);
    const consumer = await hre.ethers.getContract<Contract>(params.contract, deployer);
    const tx = await consumer.updateSubscriptionId(script.subscriptionId);
    await tx.wait();
    console.log(`Subscription id ${script.subscriptionId} is updated. | ${tx.hash}`);
  });
