import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { getNetworkConfig } from "@/scripts/LINK/utils";

/**
 * Deploys a contract named "CCGateway" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
export const contractName = "CCGateway";

const deployCCGateway: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    functions: {
      router,
      donId: { onChain: donId },
    },
  } = await getNetworkConfig(hre);

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log(`network: ${hre.network.name} | router:${router} | donId:${donId}`);
  await deploy(contractName, {
    from: deployer,
    // Contract constructor arguments
    args: [router, donId, deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
};

export default deployCCGateway;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags CCGateway
deployCCGateway.tags = [contractName];
