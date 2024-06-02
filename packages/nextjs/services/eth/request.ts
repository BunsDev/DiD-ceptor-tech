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

  const { chainId } = await provider.getNetwork();

  const exampleClientContract = (<any>deployedContracts)[chainId.toString()].CCExampleClient;
  const contract = new Contract(
    exampleClientContract.address,
    exampleClientContract.abi,
    signer
  );

  const transaction = await contract.request(args, []);

  console.log(`Functions request sent! Transaction hash ${transaction.hash}. Waiting for a response...`);
  await transaction.wait();
}
