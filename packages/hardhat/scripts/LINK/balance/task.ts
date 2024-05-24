import { task } from "hardhat/config";

import { getBalance } from "./utils";

task("link-balance", "Get LINK balance").setAction(async (_, hre) => {
  const { name } = hre.network;

  console.log(`Network: ${name}`);
  return getBalance(hre);
});
