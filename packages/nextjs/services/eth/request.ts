import { JsonRpcProvider, Wallet, Contract, encodeBytes32String } from "ethers";
import fs from "fs";
import path from "path";
import functionsConsumerAbi from "./functionsClient.json";
import getConfig from "next/config";

const subscriptionId = 2805;
const gasLimit = 300000;

export async function makeRequest(network: string, args: any[]) {
  const {
    serverRuntimeConfig: {
      providerConfig: {
        networks: networks
      }
    },
  } = getConfig();
  const networkConfig = networks.find((x: any) => x.name === network);
  if (!networkConfig) throw new Error(`Network ${network} not found in chains config`);

  const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const provider = new JsonRpcProvider(networkConfig.rpcUrl);
  const wallet = new Wallet(deployerPrivateKey);
  const signer = wallet.connect(provider); // create ethers signer for signing transactions

  console.log(`network rpc url: ${networkConfig.rpcUrl}`);

  const contract = new Contract(
    networkConfig.consumerAddress,
    functionsConsumerAbi,
    signer
  );

  const srcPath = path.resolve("./");
  console.log(`src path: ${srcPath}`);
  const source = fs.readFileSync(`${srcPath}/services/eth/source.js`).toString();

  // Actual transaction call
  const transaction = await contract.sendRequest(
    source, // source
    "0x", // user hosted secrets - encryptedSecretsUrls - empty in this example
    networkConfig.slotId, // don hosted secrets - slot ID - empty in this example
    networkConfig.secretsVersion, // don hosted secrets - version - empty in this example
    args,
    [], // bytesArgs - arguments can be encoded off-chain to bytes.
    subscriptionId,
    gasLimit,
    encodeBytes32String(networkConfig.donId) // jobId is bytes32 representation of donId
  );

  console.log(`Functions request sent! Transaction hash ${transaction.hash}. Waiting for a response...`);
  await transaction.wait();
  return transaction.hash;
}
