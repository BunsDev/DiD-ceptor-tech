import { task } from "hardhat/config";
import { Contract } from "ethers";
import { contractName } from "@/deploy/97_deploy_example_client";
import scriptsMap from "@/functions/link_functions_map.json"

task("update-subscription", "Upload subscription.")
    .addParam("file", "script file name")
    .setAction(async (params, hre) => {
        const { deployer } = await hre.getNamedAccounts();
        const chainId = await hre.getChainId();
        console.log(`Deployer: ${deployer}, ChainId: ${chainId}`);

        const scripts = (<any>scriptsMap)[chainId];
        const script = scripts[params.file];

        console.log(`Update subscription id: ${script.subscriptionId}`);
        const consumer = await hre.ethers.getContract<Contract>(contractName, deployer);
        consumer.updateSubscriptionId(script.subscriptionId);
    });
