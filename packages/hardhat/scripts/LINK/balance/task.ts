import { task } from "hardhat/config";

import { getBalance } from "./utils";
import { formatEther } from "ethers";

task("link-balance", "Get LINK balance")
  .addOptionalPositionalParam("address", "The address to check the balance of")
  .setAction(async ({ address }, hre) => {
    const { name } = hre.network;
    if (!address) {
      const { deployer } = await hre.getNamedAccounts();
      address = deployer;
    }

    console.log(`Network: ${name}`);
    console.log(`Deployer: ${address}`);

    const balance = await hre.ethers.provider.getBalance(address);
    console.log(`Balance: ${formatEther(balance)} ${name}`);

    return getBalance(hre, address);
  });
