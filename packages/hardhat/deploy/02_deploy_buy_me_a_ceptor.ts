import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { Contract } from "ethers";
import { TokenContractName } from "@/deploy/01_deploy_games_token";

/**
 * Deploys a contract named "BuyMeACeptor" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployBuyMeACeptor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const GameTokens = await hre.ethers.getContract<Contract>(TokenContractName, deployer);
  const gameTokenAddress = await GameTokens.getAddress();

  await deploy("BuyMeACeptor", {
    from: deployer,
    args: [gameTokenAddress],
    log: true,
    autoMine: true,
  });
};

export default deployBuyMeACeptor;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags BuyMeACeptor
deployBuyMeACeptor.tags = ["BuyMeACeptor"];
