import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

import { contractName } from "./00_deploy_gateway";

/**
 * Deploys a contract named "CCGateway" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */

const CLIENTS = ["CCExampleClient", "CCNotificationClient"]; // List of contract names to be registered in the gateway as clients.

const grantClientsRole: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const Gateway = await hre.ethers.getContract<Contract>(contractName, deployer);
  const clientRole = await Gateway.CLIENT_ROLE();

  console.log(`Granting "CLIENT_ROLE" to clients...`);

  for (const client of CLIENTS) {
    const contract = await hre.ethers.getContract<Contract>(client);
    if (!contract) throw new Error(`Contract ${client} not found`);

    const address = await contract.getAddress();
    const hasRole = await Gateway.hasRole(clientRole, address);
    if (hasRole) {
      console.log(`Contract ${client} already registered in the gateway`);
      continue;
    }

    console.log(`Granting "CLIENT_ROLE" to ${client}...`);
    await Gateway.grantRole(clientRole, address);
    console.log(`Contract ${client} registered in the gateway`);
  }
};

export default grantClientsRole;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags CCGateway
grantClientsRole.tags = [contractName];
