import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

export const TokenContractName = "GamesToken";
export const DAOContractName = "GamesDAOv3";
/**
 * Deploys the GamesToken and GamesDAOv3 contracts using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployGamesContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy GamesToken contract
  await deploy(TokenContractName, {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Deploy GamesDAOv3 contract with the address of the deployed GamesToken contract as a constructor argument
  await deploy(DAOContractName, {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
};

export default deployGamesContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags GamesContracts
deployGamesContracts.tags = ["GamesContracts"];
