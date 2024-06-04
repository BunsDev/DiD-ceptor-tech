import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

import { contractName as GatewayName } from "./00_deploy_gateway";

/**
 * Deploys a contract named "CCExampleClient" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
export const notificationsContractName = "CCNotificationClient";

const deployCCNotificationClient: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const Gateway = await hre.ethers.getContract<Contract>(GatewayName, deployer);
  const gwAddress = await Gateway.getAddress();

  await deploy(notificationsContractName, {
    from: deployer,
    // Contract constructor arguments
    args: [gwAddress],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
};

export default deployCCNotificationClient;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags CCExampleClient
deployCCNotificationClient.tags = [notificationsContractName];
