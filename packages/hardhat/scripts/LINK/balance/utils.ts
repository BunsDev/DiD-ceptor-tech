import { BigNumberish, formatEther, parseEther } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

import * as LinkToken from "@chainlink/contracts/abi/v0.8/LinkToken.json";

import { getNetworkConfig } from "../utils";
import { NotEnoughFundsToDistribute } from "@/errors/chainlink/functions";

const MAX_LINK_AMOUNT = "10";
const MIN_LINK_AMOUNT = "3";

let _distributionAmount: BigNumberish;

export async function getBalance(hre: HardhatRuntimeEnvironment, address?: string): Promise<bigint> {
  const {
    contracts: { token: linkTokenAddress },
  } = await getNetworkConfig(hre);

  if (!address) {
    const { deployer } = await hre.getNamedAccounts();
    address = deployer;
  }
  // @ts-expect-error: LinkToken.default exists.
  const linkContract = new hre.ethers.Contract(linkTokenAddress, LinkToken.default, hre.ethers.provider);

  const balance = await linkContract.balanceOf(address);
  console.log(`Deployer LINK balance: ${formatEther(balance)} LINK. | ${address}`);

  return balance;
}

export async function getDistributionAmount(hre: HardhatRuntimeEnvironment, scripts: bigint): Promise<BigNumberish> {
  if (_distributionAmount) return _distributionAmount;

  if (!scripts) throw new Error("No scripts to fund.");
  console.log(`Computing distribution amount for ${scripts} scripts...`);

  const balance = await getBalance(hre);
  const maxAmount = parseEther(MAX_LINK_AMOUNT);
  const minAmount = parseEther(MIN_LINK_AMOUNT);

  const distributionAmount = balance / scripts;
  if (distributionAmount < minAmount) throw new NotEnoughFundsToDistribute(balance, minAmount * scripts);

  _distributionAmount = distributionAmount > maxAmount ? maxAmount : distributionAmount;

  console.log(`Distributing ${formatEther(_distributionAmount)} LINK among ${scripts.toString()} scripts.`);
  return _distributionAmount;
}
