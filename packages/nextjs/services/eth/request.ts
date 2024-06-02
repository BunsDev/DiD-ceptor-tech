import { JsonRpcProvider, Wallet, Contract } from "ethers";
import getConfig from "next/config";
import deployedContracts from "~~/contracts/deployedContracts";

export async function makeRequest(network: string, args: any[]) {
  const {
    serverRuntimeConfig: {
      providerConfig: providerConfig
    }
  } = getConfig();

  const networkConfig = providerConfig.networks.find((x: any) => x.name === network);
  const provider = new JsonRpcProvider(networkConfig.rpcUrl);
  const wallet = new Wallet(networkConfig.deployerPrivateKey);
  const signer = wallet.connect(provider); // create ethers signer for signing transactions

  console.log(`network rpc url: ${networkConfig.rpcUrl}`);

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
