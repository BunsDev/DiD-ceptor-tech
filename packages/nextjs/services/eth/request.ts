"use server";

import { JsonRpcProvider, Wallet, Contract } from "ethers";
import chains from "~~/chains";
import deployedContracts from "~~/contracts/deployedContracts";

export async function makeRequest(network: keyof typeof chains, args: any[]) {
  const networkConfig = chains[network];
  if(!networkConfig) throw new Error(`Network ${network} not found in chains config`);

  const deployerPrivateKey =
    process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const url = networkConfig.rpcUrls.default.http[0];
  const provider = new JsonRpcProvider(url);
  const wallet = new Wallet(deployerPrivateKey);
  const signer = wallet.connect(provider); // create ethers signer for signing transactions

  console.log(`network rpc url: ${url}`);

  const { chainId } = await provider.getNetwork();
  console.log(`chainId: ${chainId}`);

  const notificationClient = (<any>deployedContracts)[chainId.toString()].CCNotificationClient;
  console.log(`notification contract address: ${notificationClient.address}`);

  const contract = new Contract(
    notificationClient.address,
    notificationClient.abi,
    signer
  );

  const transaction = await contract.request(args, []);
  console.log(`Functions request sent! Transaction hash ${transaction.hash}. Waiting for a response...`);
  await transaction.wait();
  return transaction.hash;
}
